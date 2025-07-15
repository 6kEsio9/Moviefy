package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"moviefy/main/helper/keycloak"
	"moviefy/main/helper/neshto"
	"moviefy/main/helper/queries"
	"moviefy/main/helper/webscraper"
	"net/http"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"
)

type ratingSingleFilm struct {
	Id           int     `json:"id"`
	Content      string  `json:"content"`
	LikeCount    int     `json:"likeCount"`
	Username     string  `json:"username"`
	PfpUrl       string  `json:"pfpUrl"`
	Rating       float32 `json:"rating"`
	IsLiked      bool    `json:"isLiked"`
	Title        string  `json:"title"`
	MovieId      string  `json:"movieId"`
	UserId       string  `json:"userId"`
	isValidCheck pgtype.Int4
}

type Movie struct {
	Id        string             `json:"id"`
	Title     string             `json:"title"`
	Genres    []string           `json:"genres"`
	IsAdult   bool               `json:"isAdult"`
	Year      int                `json:"year"`
	Summary   *string            `json:"summary"`
	PosterUrl *string            `json:"posterUrl"`
	AvgRating float32            `json:"avgRating"`
	Directors []string           `json:"directors"`
	Writers   []string           `json:"writers"`
	Reviews   []ratingSingleFilm `json:"reviews"`
	Cast      []string           `json:"cast"`
}

type WatchlistItem struct {
	ItemType  int    `json:"itemType"`
	TitleId   string `json:"titleId"`
	Title     string `json:"title"`
	PosterUrl string `json:"posterUrl"`
	StartYear int    `json:"startYear"`
}

type User struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Bio      string `json:"bio"`
	Pfp      string `json:"pfp"`
}

type SearchUser struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	PfpUrl   string `json:"pfpUrl"`
}

func GetMovies(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	if r.Method != http.MethodGet {
		keycloak.SendErrorResponse(w, 500, "Method not allowed")
		return
	}

	thereIsToken, ok := r.Context().Value("thereIsToken").(bool)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	movieId := r.URL.Query().Get("movieId")
	offset := r.URL.Query().Get("offset")
	log.Println(movieId == "")

	if offset == "" {
		offset = "0"
	}

	log.Println("maznichko")
	if movieId == "" {
		movies := []*neshto.SearchMovie{}
		movieRows, err := neshto.MovieDB.Query(ctx, `
			SELECT tb.tconst, tb.primaryTitle, p.posterId, tr.averageRating FROM title_basics tb
			JOIN posters p ON tb.tconst = p.titleId
			JOIN title_ratings tr ON tb.tconst = tr.tconst
			WHERE tb.startYear >= 2024
			ORDER BY tr.numVotes DESC
			OFFSET $1
			LIMIT 21;`, offset)

		if err != nil {
			fmt.Println(err)
			fmt.Println("a")
			keycloak.SendErrorResponse(w, 400, "Database error")
			return
		}
		defer movieRows.Close()
		for movieRows.Next() {
			var movie neshto.SearchMovie
			err := movieRows.Scan(
				&movie.Id,
				&movie.Title,
				&movie.PosterUrl,
				&movie.AverageRating,
			)

			if err != nil {
				fmt.Println(err)
				fmt.Println("b")
				keycloak.SendErrorResponse(w, 400, "Got an error in the db ")
				return
			}
			movies = append(movies, &movie)
		}
		log.Println("mazna")
		webscraper.C.ScrapeSearchResultDetails(&movies)

		log.Println("mazna  done")

		keycloak.SendJSONResponse(w, http.StatusOK, movies)
		return
	}

	log.Println("not mazna mn fr")
	movie := Movie{}
	row := neshto.MovieDB.QueryRow(ctx, `
		 SELECT tb.tconst, tb.primaryTitle, tb.genres, tb.isAdult, tb.startYear, p.description, p.posterId, tr.averageRating, tc.directors, tc.writers  FROM title_basics tb 
		 JOIN posters p ON tb.tconst = p.titleId 
		 JOIN title_ratings tr ON tb.tconst = tr.tconst
		 JOIN title_crew tc ON tb.tconst = tc.tconst
		 WHERE tb.tconst = $1
		 LIMIT 1;
		 `, movieId)

	error := row.Scan(
		&movie.Id,
		&movie.Title,
		&movie.Genres,
		&movie.IsAdult,
		&movie.Year,
		&movie.Summary,
		&movie.PosterUrl,
		&movie.AvgRating,
		&movie.Directors,
		&movie.Writers,
	)

	if error != nil {
		fmt.Println(error)
		fmt.Println("c")
		keycloak.SendErrorResponse(w, 400, "Database error")
		return
	}
	cast := []string{}
	castRow, err := neshto.MovieDB.Query(ctx, `
		 SELECT nb.primaryName FROM title_principals tb 
		 JOIN name_basics nb ON tb.nconst = nb.nconst
		 WHERE tb.tconst = $1`, movieId)

	if err != nil {
		fmt.Println(err)
		fmt.Println("d")
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
		return
	}
	defer castRow.Close()

	for castRow.Next() {
		var r string
		err := castRow.Scan(&r)

		if err != nil {
			fmt.Println(err)
			fmt.Println("e")
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}
		cast = append(cast, r)
	}

	movie.Cast = cast

	var query string
	var haveToken bool
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		haveToken = false
	} else {
		haveToken = true
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader && haveToken {
		fmt.Println(err)
		keycloak.SendErrorResponse(w, http.StatusUnauthorized, "Bearer token required")
		return
	}

	fmt.Println(query)

	if thereIsToken {

		userId, ok := r.Context().Value("user_id").(string)
		if !ok {
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
			return
		}

		ratings := []ratingSingleFilm{}
		ratingsRow, err := neshto.MovieDB.Query(ctx, `
		 WITH user_liked_comments AS(
		 SELECT commentId AS liked_id FROM comment_likes WHERE userId = $1
		 )
		 SELECT ur.id, ur.rating, c.likecount, c.content, u.pfpurl, u.username, tb.primaryTitle, tb.tconst, u.keycloak_user_id, ulc.liked_id FROM user_rating ur
		 JOIN users u ON ur.userid = u.keycloak_user_id
		 JOIN title_basics tb ON ur.filmid = tb.tconst
		 LEFT JOIN comments c ON ur.id = c.ratingid
		 LEFT JOIN user_liked_comments ulc ON c.Id = ulc.liked_id
		 WHERE ur.filmId = $2;`, userId, movieId)

		if err != nil {
			fmt.Println(err)
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}
		defer ratingsRow.Close()

		for ratingsRow.Next() {
			var r ratingSingleFilm
			err := ratingsRow.Scan(
				&r.Id,
				&r.Rating,
				&r.LikeCount,
				&r.Content,
				&r.PfpUrl,
				&r.Username,
				&r.Title,
				&r.MovieId,
				&r.UserId,
				&r.isValidCheck,
			)
			if err != nil {
				fmt.Println(err)
				keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Got an error in the db ")
				return
			}
			if r.isValidCheck.Valid {
				r.IsLiked = true
			}
			ratings = append(ratings, r)
		}
		movie.Reviews = ratings
	} else {

		ratings := []ratingSingleFilm{}
		ratingsRow, err := neshto.MovieDB.Query(ctx, `
		 SELECT ur.id, ur.rating, c.likecount, c.content, u.pfpurl, u.username, tb.primaryTitle, tb.tconst, u.keycloak_user_id FROM user_rating ur
		 JOIN users u ON ur.userid = u.keycloak_user_id
		 JOIN title_basics tb ON ur.filmid = tb.tconst
		 LEFT JOIN comments c ON ur.id = c.ratingid
		 WHERE ur.filmId = $1;`, movieId)

		if err != nil {
			fmt.Println(err)
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}
		defer ratingsRow.Close()

		for ratingsRow.Next() {
			var r ratingSingleFilm
			err := ratingsRow.Scan(
				&r.Id,
				&r.Rating,
				&r.LikeCount,
				&r.Content,
				&r.PfpUrl,
				&r.Username,
				&r.Title,
				&r.MovieId,
				&r.UserId,
			)
			if err != nil {
				fmt.Println(err)
				keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Got an error in the db ")
				return
			}
			ratings = append(ratings, r)
		}
		movie.Reviews = ratings

	}

	if movie.PosterUrl == nil || movie.Summary == nil {
		result, err := webscraper.C.ScrapeSingleFilmDetails(movieId)
		if err != nil {
			fmt.Println(err)
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Got an error while scraping film details ")
			return
		}
		movie.PosterUrl = &result.PosterURL
		movie.Summary = &result.PlotText
	}
	keycloak.SendJSONResponse(w, http.StatusOK, movie)
}

func SearchMovies(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	if r.Method != http.MethodGet {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var searchResults struct {
		movies []*neshto.SearchMovie
		users  []SearchUser
	}

	input := r.URL.Query().Get("input")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	users := r.URL.Query().Get("users")
	limit := 10
	offset := 0
	var err error

	if limitStr != "" {
		limit, err = strconv.Atoi(limitStr)
		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid limit")
			return
		}
	}

	if offsetStr != "" {
		offset, err = strconv.Atoi(offsetStr)
		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid offset")
			return
		}
	}

	limitPlusOffset := limit + offset

	if input == "" {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	rows, err := neshto.MovieDB.Query(ctx, queries.MovieSearchQuery, input, limit, offset, limitPlusOffset)
	if err != nil {
		log.Println(err)
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()
	var movies []*neshto.SearchMovie
	for rows.Next() {
		var movie neshto.SearchMovie

		err := rows.Scan(
			&movie.Id,
			&movie.Title,
			&movie.StartYear,
			&movie.PosterUrl,
		)

		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}

		movies = append(movies, &movie)
	}
	searchResults.movies = movies

	if users == "true" {
		rows, err := neshto.MovieDB.Query(ctx, `
			SELECT keycloak_user_id, username, pfpUrl FROM users
			WHERE username % $1
			ORDER BY similarity(username, $1) DESC
			LIMIT $2
			OFFSET $3`, input, limit, offset)
		if err != nil {
			log.Println(err)
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
			return
		}
		defer rows.Close()
		var usersArr []SearchUser
		for rows.Next() {
			var user SearchUser

			err := rows.Scan(
				&user.Id,
				&user.Username,
				&user.PfpUrl,
			)

			if err != nil {
				keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
				return
			}

			usersArr = append(usersArr, user)
		}
		searchResults.users = usersArr
	}

	keycloak.SendJSONResponse(w, http.StatusOK, searchResults)
}

// mux.HandleFunc("/user/reviews", getReviews)
func GetReviews(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}

	ctx := context.Background()

	userId := r.URL.Query().Get("userId")

	if userId == "" {
		keycloak.SendErrorResponse(w, http.StatusNoContent, "You should give userId")
		return
	}

	thereIsToken, ok := r.Context().Value("thereIsToken").(bool)
	if !ok {
		log.Println("hello")
		log.Println(thereIsToken)
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	log.Println("hello oiut")
	var ratings []ratingSingleFilm

	if thereIsToken {
		log.Println("hello")
		log.Println(r.Context())

		userIdOwn, ok := r.Context().Value("user_id").(string)
		if !ok {
			log.Println("hello")
			log.Println("hello")
			log.Println("hello")
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
			return
		}

		ratingsRow, err := neshto.MovieDB.Query(ctx, `
		 WITH user_liked_comments AS(
		 SELECT commentId AS liked_id FROM comment_likes WHERE userId = $1
		 )
		 SELECT ur.id, ur.rating, c.likecount, c.content, u.pfpurl, u.username, tb.primaryTitle, tb.tconst, u.keycloak_user_id, ulc.liked_id FROM user_rating ur
		 JOIN users u ON ur.userid = u.keycloak_user_id
		 JOIN title_basics tb ON ur.filmid = tb.tconst
		 LEFT JOIN comments c ON ur.id = c.ratingid
		 LEFT JOIN user_liked_comments ulc ON c.Id = ulc.liked_id
		 WHERE u.userId = $2;`, userIdOwn, userId)

		if err != nil {
			fmt.Println(err)
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}
		defer ratingsRow.Close()

		for ratingsRow.Next() {
			var r ratingSingleFilm
			err := ratingsRow.Scan(
				&r.Id,
				&r.Rating,
				&r.LikeCount,
				&r.Content,
				&r.PfpUrl,
				&r.Username,
				&r.Title,
				&r.MovieId,
				&r.UserId,
				&r.isValidCheck,
			)
			if err != nil {
				fmt.Println(err)
				keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Got an error in the db ")
				return
			}
			if r.isValidCheck.Valid {
				r.IsLiked = true
			}
			ratings = append(ratings, r)
		}
	} else {
		ratingsRow, err := neshto.MovieDB.Query(ctx, `
		 SELECT ur.id, ur.rating, c.likecount, c.content, u.pfpurl, u.username, tb.primaryTitle, tb.tconst, u.keycloak_user_id FROM user_rating ur
		 JOIN users u ON ur.userid = u.keycloak_user_id
		 JOIN title_basics tb ON ur.filmid = tb.tconst
		 LEFT JOIN comments c ON ur.id = c.ratingid
		 WHERE ur.userId = $1;`, userId)

		if err != nil {
			log.Println(err)
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
			return
		}
		defer ratingsRow.Close()

		for ratingsRow.Next() {
			var rating ratingSingleFilm
			err := ratingsRow.Scan(
				&rating.Id,
				&rating.Rating,
				&rating.LikeCount,
				&rating.Content,
				&rating.PfpUrl,
				&rating.Username,
				&rating.Title,
				&rating.MovieId,
				&rating.UserId,
				&rating.isValidCheck,
			)

			if err != nil {
				log.Println(err)
				keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
				return
			}

			ratings = append(ratings, rating)
		}

	}

	keycloak.SendJSONResponse(w, http.StatusOK, ratings)
}

var watchlistType = []string{"watched", "isWatching", "willWatch"}

func GetWatchList(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}

	ctx := context.Background()

	userId := r.URL.Query().Get("userId")

	if userId == "" {
		log.Println("ccccccccc")
		keycloak.SendErrorResponse(w, http.StatusNotAcceptable, "You should give userId")
		return
	}

	ratingsRow, err := neshto.MovieDB.Query(ctx, `
		SELECT w.type, tb.tconst, tb.primaryTitle, p.posterId, tb.startYear FROM watchlist w
		JOIN title_basics tb ON w.filmId = tb.tconst
		JOIN posters p ON w.filmId = p.titleId
		WHERE w.userId = $1;`, userId)

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer ratingsRow.Close()

	var watchlistItems []*neshto.SearchMovie
	for ratingsRow.Next() {
		var item neshto.SearchMovie
		err := ratingsRow.Scan(
			&item.ItemType,
			&item.Id,
			&item.Title,
			&item.PosterUrl,
			&item.StartYear,
		)

		if err != nil {
			log.Println("aaaaaaaa")
			log.Println(err)
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}

		watchlistItems = append(watchlistItems, &item)
	}
	webscraper.C.ScrapeSearchResultDetails(&watchlistItems)

	watchlist := map[string][]neshto.SearchMovie{
		"watched":    []neshto.SearchMovie{},
		"isWatching": []neshto.SearchMovie{},
		"willWatch":  []neshto.SearchMovie{},
	}

	for _, item := range watchlistItems {
		itemType := watchlistType[item.ItemType]
		watchlist[itemType] = append(watchlist[itemType], *item)
	}

	log.Println(watchlist)
	keycloak.SendJSONResponse(w, http.StatusOK, watchlist)
}

// mux.HandleFunc("/user", getUser)
func GetUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}
	userId := r.URL.Query().Get("userId")

	ctx := context.Background()

	if userId == "" {
		keycloak.SendErrorResponse(w, http.StatusNoContent, "You should give userId")
		return
	}

	ratingsRow := neshto.MovieDB.QueryRow(ctx, `
		SELECT keycloak_user_id, username, email, bio, pfpUrl FROM users
		WHERE keycloak_user_id = $1
		LIMIT 1;`, userId)

	var user User
	err := ratingsRow.Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Bio,
		&user.Pfp,
	)

	if err != nil {
		log.Println(err)
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}

	keycloak.SendJSONResponse(w, http.StatusOK, user)
}

// mux.Handle("/movies/rate", authService.AuthMiddleware(http.HandleFunc(rateMovie)))
func RateMovie(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}

	userId, ok := r.Context().Value("user_id").(string)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}
	var Params struct {
		MovieId string `json:"movieId,omitempty"`
		Rating  int    `json:"rating,omitempty"`
		Comment string `json:"comment,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&Params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if Params.MovieId == "" || Params.Rating == 0 {
		keycloak.SendErrorResponse(w, http.StatusNotAcceptable, "Invalid Params")
		return
	}

	if Params.Comment == "" {
		Params.Comment = " "
	}
	_, err := neshto.MovieDB.Exec(r.Context(), `
		WITH added_rating AS(
		INSERT INTO user_rating (rating, filmId, userId)
		VALUES ($1, $2, $3)
		RETURNING id
		),
		added_comment AS(
		INSERT INTO comments(ratingId, content)
		VALUES ((SELECT id FROM added_rating), $4)
		)
		SELECT 1;`, Params.Rating, Params.MovieId, userId, Params.Comment)

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
		return
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Added rating successfully"})
}
