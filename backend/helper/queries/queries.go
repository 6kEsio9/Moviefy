package queries

const (
	MovieSearchQuery = `
WITH 
popular_results AS (
  SELECT 
    pf.tconst, 
    pf.primarytitle, 
	  tr.averagerating,
    tr.numVotes,
    ts_rank(pf.title_tsvector, websearch_to_tsquery('english', '$1')) AS fts_rank,
    similarity(pf.primarytitle, '$1') AS fuzzy_rank,
    'popular' AS source
  FROM popular_films pf
  JOIN title_ratings tr ON pf.tconst = tr.tconst
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
    b.tconst, 
    b.primarytitle, 
	  tr.averagerating,
    COALESCE(tr.numVotes, 0) AS numVotes,
    ts_rank(to_tsvector('english', b.primarytitle), websearch_to_tsquery('english', '$1')) AS fts_rank,
    similarity(b.primarytitle, '$1') AS fuzzy_rank,
    'fallback' AS source
  FROM title_basics b
  LEFT JOIN title_ratings tr ON b.tconst = tr.tconst
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
  averagerating,
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
