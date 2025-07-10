package main

import (
	"log"
	"moviefy/main/helper/keycloak"
	"moviefy/main/helper/queries"
	"moviefy/main/helper/webscraper"
	"net/http"
)

type MovieBasics struct {
	tconst         string
	titleType      string
	primaryTitle   string
	originalTitle  string
	isAdult        bool
	startYear      int
	endYear        int
	runtimeMinutes int
	genres         []string
}

func main() {

	webscraper.C.InitCollector()
	queries.MovieDB.InitDb()

	defer queries.MovieDB.Close()
	keycloakConfig := keycloak.LoadConfig()
	authService, err := keycloak.NewAuthService(keycloakConfig)
	if err != nil {
		log.Fatal("Failed to create auth service : ", err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/login", authService.LoginHandler)
	mux.HandleFunc("/logout", authService.LogoutHandler)
	mux.HandleFunc("/refresh", authService.RefreshHandler)

	//mux.Handle("/profile", authService.AuthMiddleware(http.HandlerFunc(myFunc)))

	handler := keycloak.CorsMiddleware(mux)

	if err := http.ListenAndServe(":"+keycloakConfig.Port, handler); err != nil {
		log.Fatal("Server failed to start : ", err)
	}
}
