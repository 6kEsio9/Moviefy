package api

import (
	"context"
	"encoding/json"
	"fmt"
	"moviefy/main/helper/keycloak"
	"moviefy/main/helper/neshto"
	"moviefy/main/helper/queries"
	"moviefy/main/helper/webscraper"
	"net/http"
	"strings"
)

type ratingSingleFilm struct {
	Id        int     `json:"id"`
	Content   string  `json:"content"`
	LikeCount int     `json:"likeCount"`
	Username  string  `json:"username"`
	PfpUrl    string  `json:"pfpUrl"`
	Rating    float32 `json:"rating"`
	IsLiked   bool    `json:"isLiked"`
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
}

type User struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Bio      string `json:"bio"`
	Pfp      string `json:"pfp"`
}

func GetMovies(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	if r.Method != http.MethodGet {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	movieId := r.URL.Query().Get("movieId")
	offset := r.URL.Query().Get("offset")

	if movieId == "" {
		movies := []*neshto.SearchMovie{}
		movieRows, err := neshto.MovieDB.Query(ctx, `
			SELECT tb.tconst, tb.primaryTitle, p.posterId, tr.averageRating FROM title_basics tb
			JOIN posters p ON tb.tconst = p.titleId
			JOIN title_ratings tr ON tb.tconst = tr.tconst
			WHERE tb.startYear >= 2024
			ORDER BY tr.numVotes DESC
			OFFSET $1
			LIMIT 20;`, offset)

		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
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
				keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
				return
			}
			movies = append(movies, &movie)
		}
		webscraper.C.ScrapeSearchResultDetails(&movies)

		keycloak.SendJSONResponse(w, http.StatusOK, movies)
	}

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
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}
	cast := []string{}
	castRow, err := neshto.MovieDB.Query(ctx, `
		 SELECT nb.primaryName FROM title_principals tb 
		 JOIN name_basics nb ON tb.nconst = nb.nconst
		 WHERE tb.tconst = $1`, movieId)

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
		return
	}
	defer castRow.Close()

	for castRow.Next() {
		var r string
		err := castRow.Scan(&r)

		if err != nil {
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
		keycloak.SendErrorResponse(w, http.StatusUnauthorized, "Bearer token required")
		return
	}

	//claims, err := a.verifyToken(tokenString)
	//if err != nil {
	//	///k	keycloak.SendErrorResponse(w, http.StatusUnauthorized, fmt.Sprintf("Invalid token: %v", err))
	//		return
	//	}

	fmt.Println(query)
	ratings := []ratingSingleFilm{}
	ratingsRow, err := neshto.MovieDB.Query(ctx, `
		 SELECT ur.id, ur.rating, c.likeCount, c.content, u.pfpUrl, u.username FROM user_rating ur
		 JOIN users u ON ur.userId = u.id
		 JOIN comments c ON ur.id = c.ratingId
		 WHERE ur.filmId = $1;`, movieId)

	if err != nil {
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
		)
		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}
		ratings = append(ratings, r)
	}
	movie.Reviews = ratings

	if movie.PosterUrl == nil || movie.Summary == nil {
		result, err := webscraper.C.ScrapeSingleFilmDetails(movieId)
		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error while scraping film details ")
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

	var SearchParams struct {
		Input string `json:"input"`
		Users bool   `json:"users"`
	}

	if err := json.NewDecoder(r.Body).Decode(&SearchParams); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if SearchParams.Input == "" {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	rows, err := neshto.MovieDB.Query(ctx, queries.MovieSearchQuery, SearchParams.Input)
	if err != nil {
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

	err = webscraper.C.ScrapeSearchResultDetails(&movies)
	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error while scraping film details ")
		return
	}

	keycloak.SendJSONResponse(w, http.StatusOK, movies)
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

	//TODO: SHOULD give if the user requesting has liked some of the posts
	ratingsRow, err := neshto.MovieDB.Query(ctx, `
		 SELECT ur.id, ur.rating, c.likecount, c.content, u.pfpurl, u.username FROM user_rating ur
		 JOIN users u ON ur.userid = u.id
		 JOIN comments c ONur.id = c.ratingid
		 WHERE ur.userId = $1;`, userId)

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer ratingsRow.Close()

	var ratings []ratingSingleFilm
	for ratingsRow.Next() {
		var rating ratingSingleFilm
		err := ratingsRow.Scan(
			&rating.Id,
			&rating.Rating,
			&rating.LikeCount,
			&rating.Content,
			&rating.PfpUrl,
			&rating.Username,
		)

		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}

		ratings = append(ratings, rating)
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
		keycloak.SendErrorResponse(w, http.StatusNoContent, "You should give userId")
		return
	}

	ratingsRow, err := neshto.MovieDB.Query(ctx, `
		SELECT w.type, tb.tconst, tb.primaryTitle, p.posterId FROM watchlist w
		JOIN title_basics tb ON w.filmId = tb.tconst
		JOIN posters p ON w.filmId = p.titleId
		WHERE w.userId = $1;`, userId)

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer ratingsRow.Close()

	var watchlistItems []WatchlistItem
	for ratingsRow.Next() {
		var item WatchlistItem
		err := ratingsRow.Scan(
			&item.ItemType,
			&item.TitleId,
			&item.Title,
			&item.PosterUrl,
		)

		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Got an error in the db ")
			return
		}

		watchlistItems = append(watchlistItems, item)
	}

	watchlist := map[string][]WatchlistItem{
		"watched":    []WatchlistItem{},
		"isWatching": []WatchlistItem{},
		"willWatch":  []WatchlistItem{},
	}

	for _, item := range watchlistItems {
		itemType := watchlistType[item.ItemType]
		watchlist[itemType] = append(watchlist[itemType], item)
	}

	keycloak.SendJSONResponse(w, http.StatusOK, watchlist)
}

// mux.HandleFunc("/user", getUser)
func GetUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}
	username := r.URL.Query().Get("username")

	ctx := context.Background()

	if username == "" {
		keycloak.SendErrorResponse(w, http.StatusNoContent, "You should give userId")
		return
	}

	ratingsRow := neshto.MovieDB.QueryRow(ctx, `
		SELECT id, username, email, bio, pfpUrl FROM users
		WHERE username = $1
		LIMIT 1;`, username)

	var user User
	err := ratingsRow.Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Bio,
		&user.Pfp,
	)

	if err != nil {
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

	username, ok := r.Context().Value("username").(string)
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
	var ratingId int
	err := neshto.MovieDB.QueryRow(r.Context(), `
		INSERT INTO user_rating (rating, filmId, userId)
		VALUES ($1, $2, (SELECT id FROM users WHERE username = $3 LIMIT 1))
		RETURNING id;`, Params.Rating, Params.MovieId, username).Scan(&ratingId)

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
		return
	}

	if Params.Comment != "" {
		err := neshto.MovieDB.QueryRow(r.Context(), `
			INSERT INTO comments(ratingId, content)
			VALUES ($1, $2);`, ratingId, Params.Comment).Scan()
		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
			return
		}
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Added rating successfully"})
}
