package api

import (
	"encoding/json"
	"log"
	"moviefy/main/helper/keycloak"
	"moviefy/main/helper/neshto"
	s3helper "moviefy/main/helper/s3"
	"net/http"
	"path/filepath"
	"strings"
)

func DeleteReview(w http.ResponseWriter, r *http.Request) {
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
	}

	if err := json.NewDecoder(r.Body).Decode(&Params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if Params.MovieId == "" {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid param")
		return
	}

	_, err := neshto.MovieDB.Exec(r.Context(), `
		WITH deleted_rating AS(
		DELETE FROM user_rating
		WHERE filmId = $1 AND userId = $2
		RETURNING id
		),
		deleted_comment AS (
		DELETE FROM comments
		WHERE ratingId = (SELECT id FROM deleted_rating)
		RETURNING id
		)
		DELETE FROM comment_likes
		WHERE commentId = (SELECT id FROM deleted_comment);`, Params.MovieId, userId)

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

	userId, ok := r.Context().Value("user_id").(string)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	var Params struct {
		CommentId string `json:"commentId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&Params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if Params.CommentId == "" {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid param")
		return
	}

	_, err := neshto.MovieDB.Exec(r.Context(), `
		WITH comment_id AS(
		SELECT id FROM comments
		WHERE ratingId = $2
		LIMIT 1
		),
		deleted_like AS (
		DELETE FROM comment_likes
		WHERE commentId = (
		SELECT id FROM comments WHERE ratingId = $2 LIMIT 1
		) AND userId = $1
		RETURNING *
		),
		inserted_like AS(
		INSERT INTO comment_likes(commentId, userId)
		SELECT (
			SELECT id FROM comments WHERE ratingId = $2 LIMIT 1
		), $1
		WHERE NOT EXISTS (SELECT 1 FROM deleted_like)
		RETURNING *
		),
		update_comment_increase AS (
		UPDATE comments
		SET likeCount = likeCount + 1
		WHERE ratingId= $2 AND EXISTS (SELECT 1 FROM inserted_like)
		),
		update_comment_decrease AS (
		UPDATE comments
		SET likeCount = likeCount - 1
		WHERE ratingId= $2 AND EXISTS (SELECT 1 FROM deleted_like)
		)
		SELECT 1;`, userId, Params.CommentId)

	if err != nil {
		log.Println(err)
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

	userId, ok := r.Context().Value("user_id").(string)
	if !ok {
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get username")
		return
	}

	var Params struct {
		MovieId string `json:"movieId,omitempty"`
		Comment string `json:"comment,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&Params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if Params.MovieId == "" || Params.Comment == "" {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid param")
		return
	}

	_, err := neshto.MovieDB.Exec(r.Context(), `
		UPDATE comments 
		SET content = $1
		WHERE ratingId = (
		SELECT id FROM user_rating ur 
		WHERE ur.filmId = $2
		and userId = $3
		);
		`, Params.Comment, Params.MovieId, userId)

	if err != nil {
		log.Println(err)
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

	userId := r.Context().Value("user_id")

	var Params struct {
		MovieId string `json:"movieId"`
		Status  int    `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&Params); err != nil {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if Params.MovieId == "" || Params.Status < 0 || Params.Status >= 4 {
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Invalid param")
		return
	}
	if Params.Status == 3 {
		_, err := neshto.MovieDB.Exec(r.Context(), `
			DELETE FROM watchlist 
			WHERE filmId = $1 AND userId = $2;`, Params.MovieId, userId)
		if err != nil {
			log.Println(err)
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
			return
		}

		keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Edited watchlist status successfully"})
		return
	}
	//TODO: if params.status is 3 then remove the watchlist item
	_, err := neshto.MovieDB.Exec(r.Context(), `
    WITH updated_status AS (
        UPDATE watchlist
        SET type = $1
        WHERE filmId = $2 AND userId = $3
        RETURNING *
    )
    INSERT INTO watchlist (filmId, userId, type)
    SELECT $2, $3, $1
    WHERE NOT EXISTS (SELECT 1 FROM updated_status)`,
		Params.Status, Params.MovieId, userId)

	if err != nil {
		log.Println(err)
		keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
		return
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Edited watchlist status successfully"})
}

// mux.Handle("/user/edit", authService.AuthMiddleware(http.HandlerFunc(editUser)))
func EditUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		log.Println(r.Method)
		keycloak.SendErrorResponse(w, http.StatusMethodNotAllowed, "Status method not allowed")
		return
	}
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		log.Println(err)
		keycloak.SendErrorResponse(w, http.StatusBadRequest, "Error parsing the form ")
		return
	}

	var s3key string

	bio := r.FormValue("bio")
	NewPassword := r.FormValue("newPassword")
	file, handler, err := r.FormFile("pfp")
	if err == nil {
		defer file.Close()
		s3key = s3helper.S3Instance.GenerateFileNameWithFolder("pfp", handler.Filename)

		contentType := "image/jpeg"
		ext := strings.ToLower(filepath.Ext(handler.Filename))
		switch ext {
		case ".png":
			contentType = "image/png"
		case ".gif":
			contentType = "image/gif"
		case ".webp":
			contentType = "image/webp"
		case ".bmp":
			contentType = "image/bmp"
		}

		err = s3helper.S3Instance.UploadPicture(r.Context(), s3key, file, contentType)
		if err != nil {
			log.Println(err)
			keycloak.SendErrorResponse(w, http.StatusBadRequest, "Got an error while uploading the file to s3")
			return
		}

	} else {
		s3key = ""
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

	if NewPassword != "" {
		err := authService.SetUserPassword(userId, NewPassword)
		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "Failed to update password")
			return
		}
	}
	if bio != "" {
		_, err := neshto.MovieDB.Exec(r.Context(), `
		UPDATE users
		SET bio = $1
		WHERE keycloak_user_id = $2;`, bio, userId)

		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
			return
		}
	}

	if s3key != "" {
		_, err := neshto.MovieDB.Exec(r.Context(), `
			UPDATE users
			SET pfpUrl = $1
			WHERE keycloak_user_id = $2;`, s3key, userId)
		if err != nil {
			keycloak.SendErrorResponse(w, http.StatusInternalServerError, "DB error")
			return
		}
	}

	keycloak.SendJSONResponse(w, http.StatusOK, map[string]string{"message": "Edited user data successfully", "pfpUrl": s3key})
}
