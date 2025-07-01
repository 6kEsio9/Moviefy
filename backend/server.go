package main

import "net/http"

func searchMovies(w http.ResponseWriter, r *http.Request) {

}

func main() {
	http.Handle("/search", searchMovies)
}
