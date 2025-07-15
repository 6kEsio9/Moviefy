package neshto

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type LoginResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"`
	TokenType    string `json:"tokenType"`
}

type SearchMovie struct {
	Id            string  `json:"id"`
	Title         string  `json:"title"`
	PosterUrl     *string `json:"posterUrl"`
	StartYear     int     `json:"startYear"`
	AverageRating float32 `json:"averageRating,omitempty"`
	ItemType      int     `json:"itemType,omitempty"`
}

type DB struct {
	*pgxpool.Pool
}

var MovieDB *DB
