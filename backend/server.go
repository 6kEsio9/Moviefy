package main

import (
	"log"
	"moviefy/main/api"
	"moviefy/main/helper/keycloak"
	"moviefy/main/helper/neshto"
	"moviefy/main/helper/queries"
	"moviefy/main/helper/webscraper"
	"net/http"
)

func main() {

	neshto.MovieDB = &neshto.DB{}
	webscraper.C.InitCollector()
	queries.InitDb(neshto.MovieDB)

	defer neshto.MovieDB.Close()
	keycloakConfig := keycloak.LoadConfig()
	authService, err := keycloak.NewAuthService(keycloakConfig)
	if err != nil {
		log.Fatal("Failed to create auth service : ", err)
	}

	mux := http.NewServeMux()

	/*
		type LoginRequest struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		* */
	mux.HandleFunc("/login", authService.LoginHandler)
	mux.HandleFunc("/logout", authService.LogoutHandler)
	mux.HandleFunc("/refresh", authService.RefreshHandler)
	mux.HandleFunc("/register", authService.RegisterHandler)

	/*
					movieId := r.URL.Query().Get("movieId")
					offset := r.URL.Query().Get("offset")
				ako nqma movieId
								&movie.Id,
								&movie.Title,
								&movie.PosterUrl,
								&movie.AverageRating,
				ako ima movieId

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
				* */
	mux.HandleFunc("/movies", api.GetMovies)
	mux.HandleFunc("/search", api.SearchMovies)

	/*
				userId := r.URL.Query().Get("userId")
		poluchavash:
		type ratingSingleFilm struct {
			Id        int     `json:"id"`
			Content   string  `json:"content"`
			LikeCount int     `json:"likeCount"`
			Username  string  `json:"username"`
			PfpUrl    string  `json:"pfpUrl"`
			Rating    float32 `json:"rating"`
			IsLiked   bool    `json:"isLiked"`
		}
			* */
	mux.HandleFunc("/user/reviews", api.GetReviews) /*
		userId := r.URL.Query().Get("userId")
	* */
	mux.HandleFunc("/watchlist", api.GetWatchList)
	mux.HandleFunc("/users", api.GetUser)

	mux.Handle("/change", authService.AuthMiddleware(http.HandlerFunc(api.ChangeMovieStatus)))
	//zashto samo comentara se smenq,a
	mux.Handle("/users/reviews/edit", authService.AuthMiddleware(http.HandlerFunc(api.EditReview)))
	/*
		var Params struct {
			MovieId string `json:"movieId,omitempty"`
		}
	* */
	mux.Handle("/users/reviews/delete", authService.AuthMiddleware(http.HandlerFunc(api.DeleteReview)))
	/*
		var Params struct {
			CommentId string `json:"commentId"`
		}
	* */
	mux.Handle("/users/reviews/like", authService.AuthMiddleware(http.HandlerFunc(api.LikeReview)))
	/*
		*
			var Params struct {
				MovieId string `json:"movieId,omitempty"`
				Rating  int    `json:"rating,omitempty"`
				Comment string `json:"comment,omitempty"`
			}
		**/
	mux.Handle("/movies/rate", authService.AuthMiddleware(http.HandlerFunc(api.RateMovie)))
	//mux.Handle("/user/edit", authService.AuthMiddleware(http.HandlerFunc(editUser)))

	handler := keycloak.CorsMiddleware(authService.AdminTokenMiddleware(mux))

	log.Println("dinozavur")
	if err := http.ListenAndServe(":"+keycloakConfig.Port, handler); err != nil {
		log.Fatal("Server failed to start : ", err)
	}
}
