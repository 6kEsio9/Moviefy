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
	Id            string
	Title         string
	PosterUrl     *string
	StartYear     int
	AverageRating float32
}

type DB struct {
	*pgxpool.Pool
}

var MovieDB *DB
