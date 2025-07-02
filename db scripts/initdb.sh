# !/bin/bash

#export PGPASSWORD="hJMQzdBH7nMybpb9z6O2"
#psql -h moviefy-db.cr6yyy0eum40.eu-north-1.rds.amazonaws.com -p 5432 -U moviefy -d moviefy

DB_HOST="moviefy-db.cr6yyy0eum40.eu-north-1.rds.amazonaws.com"
DB_PORT="5432"
DB_NAME="moviefy"
DB_USER="moviefy"
DB_PASSWORD="hJMQzdBH7nMybpb9z6O2"

export PGPASSWORD="$DB_PASSWORD"

echo "resetting db"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<EOSQL
DROP TABLE IF EXISTS 
    title_basics, 
    name_basics, 
    posters,
    title_akas, 
    title_crew, 
    title_episode, 
    title_principals, 
    title_ratings CASCADE;
EOSQL

echo "Applying db schema"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f schema.sql

# title_basics
echo "Importing title_basics..."
./awkTest.sh "db tsv files/title.basics.tsv" 9 |
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
COPY title_basics FROM STDIN WITH (
    FORMAT csv,
    DELIMITER E'\t',
    NULL '\\N',
    QUOTE E'\b'
);"

# name_basics
echo "Importing name_basics..."
./awkTest.sh "db tsv files/name.basics.tsv" 5 6 |
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
COPY name_basics FROM STDIN WITH (
    FORMAT csv,
    DELIMITER E'\t',
    NULL '\\N',
    QUOTE E'\b'
);"

# title_akas
echo "Importing title_akas..."
./awkTest.sh "db tsv files/title.akas.tsv" 6 7 |
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
COPY title_akas FROM STDIN WITH (
    FORMAT csv,
    DELIMITER E'\t',
    NULL '\\N',
    QUOTE E'\b'
);"

# title_crew
echo "Importing title_crew..."
./awkTest.sh "db tsv files/title.crew.tsv" 2 3 |
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
COPY title_crew FROM STDIN WITH (
    FORMAT csv,
    DELIMITER E'\t',
    NULL '\\N',
    QUOTE E'\b'
);"

# title_episode
echo "Importing title_episode..."
tail -n +2 "db tsv files/title.episode.tsv" |
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
COPY title_episode FROM STDIN WITH (
    FORMAT csv,
    DELIMITER E'\t',
    NULL '\\N',
    QUOTE E'\b'
);"

# title_principals
echo "Importing title_principals..."
tail -n +2 "db tsv files/title.principals.tsv" |
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
COPY title_principals FROM STDIN WITH (
    FORMAT csv,
    DELIMITER E'\t',
    NULL '\\N',
    QUOTE E'\b'
);"

# title_ratings
echo "Importing title_ratings..."
tail -n +2 "db tsv files/title.ratings.tsv" |
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
COPY title_ratings FROM STDIN WITH (
    FORMAT csv,
    DELIMITER E'\t',
    NULL '\\N',
    QUOTE E'\b'
);"

echo "Import completed!"

# row counts
echo "Row counts:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT 'title_basics' as table_name, count(*) FROM title_basics
UNION ALL
SELECT 'name_basics', count(*) FROM name_basics
UNION ALL
SELECT 'title_akas', count(*) FROM title_akas
UNION ALL
SELECT 'title_crew', count(*) FROM title_crew
UNION ALL
SELECT 'title_episode', count(*) FROM title_episode
UNION ALL
SELECT 'title_principals', count(*) FROM title_principals
UNION ALL
SELECT 'title_ratings', count(*) FROM title_ratings;
"
