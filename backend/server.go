package main

import (
	"log"
	"moviefy/main/api"
	"moviefy/main/helper/keycloak"
	"moviefy/main/helper/neshto"
	"moviefy/main/helper/queries"
	s3helper "moviefy/main/helper/s3"
	"moviefy/main/helper/webscraper"
	"net/http"
)

func main() {

	neshto.MovieDB = &neshto.DB{}
	webscraper.C.InitCollector()
	queries.InitDb(neshto.MovieDB)

	s3helper.InitializeS3()

	defer neshto.MovieDB.Close()
	keycloakConfig := keycloak.LoadConfig()
	authService, err := keycloak.NewAuthService(keycloakConfig)
	if err != nil {
		log.Fatal("Failed to create auth service : ", err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/login", authService.LoginHandler)
	mux.HandleFunc("/logout", authService.LogoutHandler)
	mux.HandleFunc("/refresh", authService.RefreshHandler)
	mux.HandleFunc("/register", authService.RegisterHandler)

	mux.Handle("/movies", authService.LoselyGetAuth(http.HandlerFunc(api.GetMovies)))
	mux.HandleFunc("/search", api.SearchMovies)
	mux.HandleFunc("/movies/genres", api.GetGenreMovies)

	mux.Handle("/users/reviews", authService.LoselyGetAuth(http.HandlerFunc(api.GetReviews)))
	mux.HandleFunc("/watchlist", api.GetWatchList)
	mux.HandleFunc("/users", api.GetUser)

	mux.Handle("/change", authService.AuthMiddleware(http.HandlerFunc(api.ChangeMovieStatus)))
	mux.Handle("/movies/add", authService.AuthMiddleware(http.HandlerFunc(api.AddFilm)))
	mux.Handle("/users/reviews/edit", authService.AuthMiddleware(http.HandlerFunc(api.EditReview)))
	mux.Handle("/users/reviews/delete", authService.AuthMiddleware(http.HandlerFunc(api.DeleteReview)))
	mux.Handle("/users/reviews/like", authService.AuthMiddleware(http.HandlerFunc(api.LikeReview)))
	mux.Handle("/movies/rate", authService.AuthMiddleware(http.HandlerFunc(api.RateMovie)))
	mux.Handle("/users/edit", authService.AuthMiddleware(http.HandlerFunc(api.EditUser)))

	handler := keycloak.CorsMiddleware(authService.AdminTokenMiddleware(mux))

	log.Println("dinozavur")
	if err := http.ListenAndServe(":"+keycloakConfig.Port, handler); err != nil {
		log.Fatal("Server failed to start : ", err)
	}
}
