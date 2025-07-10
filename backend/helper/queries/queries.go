package queries

import (
	"context"
	"fmt"
	"log"
	"moviefy/main/helper/webscraper"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

/*
SELECT tb.primaryTitle, averageRating, numVotes, tb.startyear, tb.tconst, tb.titletype FROM title_ratings AS tr INNER JOIN title_basics AS tb ON tr.
tconst = tb.tconst WHERE tr.numVotes > 10000 AND tb.titleType = 'movie' ORDER BY tr.averageRating DESC LIMIT 10 ;
*/

const (
	MovieSearchQuery = `
WITH 
popular_results AS (
  SELECT 
		pf.startyear,
    pf.tconst, 
    pf.primarytitle, 
		ps.posterId,
    tr.numVotes,
    ts_rank(pf.title_tsvector, websearch_to_tsquery('english', '$1')) AS fts_rank,
    similarity(pf.primarytitle, '$1') AS fuzzy_rank,
    'popular' AS source
  FROM popular_films pf
  JOIN title_ratings tr ON pf.tconst = tr.tconst
	JOIN posters ps ON pf.tconst = ps.titleId
  WHERE 
    pf.title_tsvector @@ websearch_to_tsquery('english', '$1') OR
    pf.primarytitle % '$1'
  ORDER BY 
    tr.numVotes DESC,
    GREATEST(
      ts_rank(pf.title_tsvector, websearch_to_tsquery('english', '$1')),
      similarity(pf.primarytitle, '$1')
    ) DESC
  LIMIT $2 + $3 
),

popular_count AS (
  SELECT COUNT(*) AS count FROM popular_results
),

fallback_results AS (
  SELECT 
		b.startyear,
    b.tconst, 
    b.primarytitle, 
		ps.posterId,
    COALESCE(tr.numVotes, 0) AS numVotes,
    ts_rank(to_tsvector('english', b.primarytitle), websearch_to_tsquery('english', '$1')) AS fts_rank,
    similarity(b.primarytitle, '$1') AS fuzzy_rank,
    'fallback' AS source
  FROM title_basics b
  LEFT JOIN title_ratings tr ON b.tconst = tr.tconst
	JOIN posters ps ON b.tconst = ps.titleId
  WHERE 
    (to_tsvector('english', b.primarytitle) @@ websearch_to_tsquery('english', '$1') OR
     b.primarytitle % '$1')
    AND b.tconst NOT IN (SELECT tconst FROM popular_results)  
    AND (SELECT count FROM popular_count) < $2 + $3  
  ORDER BY 
    COALESCE(tr.numVotes, 0) DESC,
    GREATEST(
      ts_rank(to_tsvector('english', b.primarytitle), websearch_to_tsquery('english', '$1')),
      similarity(b.primarytitle, '$1')
    ) DESC
  LIMIT GREATEST(0, $2 + $3 - (SELECT count FROM popular_count))  
)

SELECT 
  tconst, 
  primarytitle, 
	startyear,
	posterId
FROM (
  SELECT * FROM popular_results
  UNION ALL
  SELECT * FROM fallback_results
) combined
ORDER BY 
  CASE WHEN source = 'popular' THEN 0 ELSE 1 END,
  numVotes DESC,
  GREATEST(fts_rank, fuzzy_rank) DESC
LIMIT $2
OFFSET $3;
    `
)

type DB struct {
	*pgxpool.Pool
}

var MovieDB *DB

func (db *DB) getMovieSearchResults(searchString string, offset int, limit int) ([]webscraper.SearchItem, error) {

	rows, err := db.Query(context.Background(), MovieSearchQuery, searchString, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("search query failed: %w", err)
	}
	defer rows.Close()

	var movies []webscraper.SearchItem
	var m webscraper.SearchItem
	for rows.Next() {
		err := rows.Scan(&m.ID, &m.MovieName, &m.MovieStart, &m.PosterURL)
		if err != nil {
			return nil, fmt.Errorf("scan failed: %w", err)
		}
		movies = append(movies, m)
	}

	return movies, nil
}

func (db *DB) InitDb() {
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
	db.Pool = pool

	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}
}
