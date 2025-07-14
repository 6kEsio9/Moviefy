package api

import (
	"encoding/json"
	"moviefy/main/helper/keycloak"
	"moviefy/main/helper/neshto"
	"net/http"
)

func DeleteReview(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}

	username, ok := r.Context().Value("username").(string)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	var params struct {
		MovieId string `json:"movieId,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if params.MovieId == "" {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid param")
		return
	}

	err := neshto.MovieDB.QueryRow(r.Context(), `WITH current_user AS(
		SELECT id FROM users 
		WHERE username = $1
		LIMIT 1
		),
		deleted_rating AS(
		DELETE FROM user_rating
		WHERE id = $2 AND userId = (SELECT id FROM current_user)
		RETURNING id
		),
		deleted_comment AS (
		DELETE FROM comments
		WHERE ratingId = (SELECT id FROM deleted_rating)
		RETURNING id
		)
		DELETE FROM comment_likes
		WHERE commentId = (SELECT id FROM deleted_comment);`, params.MovieId, username).Scan()

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
		return
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Removed rating successfully"})
}

// mux.Handle("/user/reviews/like", authService.AuthMiddleware(http.HandlerFunc(likeReview)))
func LikeReview(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}

	username, ok := r.Context().Value("username").(string)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	var params struct {
		CommentId string `json:"commentId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if params.CommentId == "" {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid param")
		return
	}

	err := neshto.MovieDB.QueryRow(r.Context(), `
		WITH current_user AS(
		SELECT id AS user_id FROM users 
		WHERE username = $1
		LIMIT 1
		),
		deleted_like AS (
		DELETE FROM comment_likes
		WHERE commentId = $2 AND userId = (SELECT user_id from current_user)
		RETURNING *
		),
		inserted_like AS(
		INSERT INTO comment_likes(commentId, userId)
		SELECT $2, userId FROM current_user
		WHERE NOT EXISTS (SELECT 1 FROM deleted_like)
		RETURNING *
		)
		update_comment_increase AS (
		UPDATE comments
		SET likeCount = likeCount + 1
		WHERE id= $2 AND EXISTS (SELECT 1 FROM inserted_like)
		)
		update_comment_decrease AS (
		UPDATE comments
		SET likeCount = likeCount - 1
		WHERE id= $2 AND EXISTS (SELECT 1 FROM deleted_like)
		)
		SELECT 1;`, username, params.CommentId).Scan()

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
		return
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Removed rating successfully"})
}

// mux.Handle("/user/reviews/edit", authService.AuthMiddleware(http.HandleFunc(editReview)))
func EditReview(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}

	username, ok := r.Context().Value("username").(string)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	var params struct {
		CommentId string `json:"commentId,omitempty"`
		Comment   string `json:"comment,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if params.CommentId == "" || params.Comment == "" {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid param")
		return
	}

	err := neshto.MovieDB.QueryRow(r.Context(), `
		WITH current_user AS(
		SELECT ur.id AS rating_id FROM users u
		JOIN user_rating ur ON u.id = ur.userId
		JOIN comments c ON ur.id = c.ratingId
		WHERE username = $1 AND c.id = $2
		LIMIT 1
		),
		update_comment AS(
		UPDATE comments 
		SET content = $3
		WHERE comments.ratingId = (SELECT rating_id FROM current_user) AND comments.id = $2
		)
		SELECT 1;`, username, params.CommentId, params.Comment).Scan()

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
		return
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Edited rating successfully"})
}

// mux.Handle("/change", authService.AuthMiddleware(http.HandleFunc(changeMovieStatus)))
func ChangeMovieStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}

	username, ok := r.Context().Value("username").(string)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	var params struct {
		MovieId string `json:"movieId"`
		Status  int    `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if params.MovieId == "" || params.Status < 0 || params.Status >= 4 {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid param")
		return
	}

	err := neshto.MovieDB.QueryRow(r.Context(), `
		UPDATE watchlist 
		SET type = $1
		WHERE filmId = $2 AND userId = (
		SELECT id FROM users WHERE username = $3 
		LIMIT 1);`, params.Status, params.MovieId, username).Scan()

	if err != nil {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
		return
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Edited watchlist status successfully"})
}

// mux.Handle("/user/edit", authService.AuthMiddleware(http.HandlerFunc(editUser)))
func EditUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}

	userId, ok := r.Context().Value("user_id").(string)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	authService, ok := r.Context().Value("AuthService").(*keycloak.AuthService)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get auth service")
	}

	//trqbva da e multipart form data za da dava snimki
	var params struct {
		Bio string `json:"bio,omitempty"`
		//	Pfp         string `json:"pfp,omitempty"`
		//	Email string
		NewPassword string `json:"NewPassword,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if params.NewPassword != "" {
		err := authService.SetUserPassword(userId, params.NewPassword)
		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to update password")
			return
		}
	}
	if params.Bio != "" {
		err := neshto.MovieDB.QueryRow(r.Context(), `
		UPDATE users
		SET bio = $1
		WHERE username = $2;`, params.Bio).Scan()

		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
			return
		}
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Edited user data successfully"})
}
