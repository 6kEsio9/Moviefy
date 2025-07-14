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

	mux.HandleFunc("/login", authService.LoginHandler)
	mux.HandleFunc("/logout", authService.LogoutHandler)
	mux.HandleFunc("/refresh", authService.RefreshHandler)
	mux.HandleFunc("/register", authService.RegisterHandler)

	mux.HandleFunc("/movies", api.GetMovies)
	mux.HandleFunc("/search", api.SearchMovies)

	mux.HandleFunc("/user/reviews", api.GetReviews)
	mux.HandleFunc("/watchlist", api.GetWatchList)
	mux.HandleFunc("/user/", api.GetUser)

	mux.Handle("/change", authService.AuthMiddleware(http.HandlerFunc(api.ChangeMovieStatus)))
	//zashto samo comentara se smenq,a
	mux.Handle("/user/reviews/edit", authService.AuthMiddleware(http.HandlerFunc(api.EditReview)))
	mux.Handle("/user/reviews/delete", authService.AuthMiddleware(http.HandlerFunc(api.DeleteReview)))
	mux.Handle("/user/reviews/like", authService.AuthMiddleware(http.HandlerFunc(api.LikeReview)))
	mux.Handle("/movies/rate", authService.AuthMiddleware(http.HandlerFunc(api.RateMovie)))
	//mux.Handle("/user/edit", authService.AuthMiddleware(http.HandlerFunc(editUser)))

	handler := keycloak.CorsMiddleware(authService.AdminTokenMiddleware(mux))

	log.Println("dinozavur")
	if err := http.ListenAndServe(":"+keycloakConfig.Port, handler); err != nil {
		log.Fatal("Server failed to start : ", err)
	}
}
