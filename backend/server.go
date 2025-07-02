package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
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

func getMovieSearchReslt(searchString string) ([]MovieBasics, error) {
	/*
	   	SELECT tconst, primarytitle, startyear, genres
	   FROM title_basics
	   WHERE
	   to_tsvector('english', COALESCE(primarytitle, ' ')) @@ websearch_to_tsquery('english', 'capitan')
	   LIMIT 10;
	*/
	sql := `
        SELECT tconst, primarytitle, startyear, genres
        FROM title_basics
        WHERE 
            to_tsvector('english', primarytitle || ' ' || genres) @@ 
            websearch_to_tsquery('english', $1)
        ORDER BY 
            ts_rank(
                to_tsvector('english', primarytitle || ' ' || genres),
                websearch_to_tsquery('english', $1)
            ) DESC
        LIMIT 10
    `

	rows, err := r.db.Query(context.Background(), sql, searchString)
	if err != nil {
		return nil, fmt.Errorf("search query failed: %w", err)
	}
	defer rows.Close()

	var movies []MovieBasics
	for rows.Next() {
		var m MovieBasics
		err := rows.Scan(&m.ID, &m.Title, &m.Description, &m.ReleaseYear, &m.Rating)
		if err != nil {
			return nil, fmt.Errorf("scan failed: %w", err)
		}
		movies = append(movies, m)
	}

	return movies, nil
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Could not load .env file")
		return
	}

	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=require",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		log.Fatalf("Unable to parse database URL: %v\n", err)
	}

	config.MaxConns = int32(10)
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = time.Minute * 30

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}
	defer pool.Close()

	var greeting string
	err = pool.QueryRow(context.Background(), "select ").Scan(&greeting)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println(greeting)
}
