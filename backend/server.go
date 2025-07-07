package main

import (
	"context"
	"fmt"
	"log"
	queries "moviefy/main/helper"
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

type DB struct {
	*pgxpool.Pool
}

var MovieDB *DB
const 

/*
SELECT tb.primaryTitle, averageRating, numVotes, tb.startyear, tb.tconst, tb.titletype FROM title_ratings AS tr INNER JOIN title_basics AS tb ON tr.
tconst = tb.tconst WHERE tr.numVotes > 10000 AND tb.titleType = 'movie' ORDER BY tr.averageRating DESC LIMIT 10 ;
*/
func (db *DB) getMovieSearchReslt(searchString string, offset int, limit int) ([]MovieBasics, error) {

	rows, err := db.Query(context.Background(), queries.MovieSearchQuery, searchString, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("search query failed: %w", err)
	}
	defer rows.Close()

	var movies []MovieBasics
	/*
	  tconst,
	  primarytitle,
	  numVotes,
	  fts_rank,
	  fuzzy_rank,
	  source
	* */
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

	MovieDB = &DB{pool}
	MovieDB.getMovieSearchReslt

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
