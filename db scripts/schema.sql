CREATE EXTENSION IF NOT EXISTS pg_trgm; 
CREATE EXTENSION IF NOT EXISTS intarray;

-- Core tables
CREATE TABLE title_basics (
    tconst TEXT PRIMARY KEY,
    titleType TEXT NOT NULL,
    primaryTitle TEXT NOT NULL,
    originalTitle TEXT,
    isAdult BOOLEAN NOT NULL,
    startYear INTEGER ,
    endYear INTEGER ,
    runtimeMinutes INTEGER ,
    genres TEXT[],
    omdbid TEXT UNIQUE,
);

CREATE TABLE name_basics (
    nconst TEXT PRIMARY KEY,
    primaryName TEXT ,
    birthYear INTEGER ,
    deathYear INTEGER ,
    primaryProfession TEXT[],
    knownForTitles TEXT[]
);

CREATE TABLE title_akas (
    titleId TEXT ,
    ordering INTEGER NOT NULL,
    title TEXT NOT NULL,
    region TEXT,
    language TEXT,
    types TEXT[],
    attributes TEXT[],
    isOriginalTitle BOOLEAN,
    PRIMARY KEY (titleId, ordering)
);

CREATE TABLE title_crew (
    tconst TEXT PRIMARY KEY ,
    directors TEXT[] ,
    writers TEXT[]
);

CREATE TABLE title_episode (
    tconst TEXT PRIMARY KEY,
    parentTconst TEXT,
    seasonNumber INTEGER,
    episodeNumber INTEGER
);

CREATE TABLE image_ids (
   image_id TEXT PRIMARY KEY,
   object_id TEXT,
  object_type TEXT,
  image_version TEXT
);

CREATE TABLE image_licenses(
    image_id TEXT PRIMARY KEY REFERENCES image_ids(image_id) ON DELETE CASCADE,
  source TEXT,
  license_id TEXT,
  author TEXT
);

CREATE TABLE trailers(
  trailer_id TEXT ,
  key TEXT,
  movie_id TEXT REFERENCES title_basics(omdbid) ON DELETE CASCADE,
  language TEXT,
  source TEXT
);

CREATE TABLE movie_abstracts (
  movie_id TEXT PRIMARY KEY REFERENCES title_basics(omdbid) ON DELETE CASCADE,
  abstract TEXT
);

CREATE TABLE movie_links (
  tconst TEXT,
  movie_id TEXT
);

CREATE TABLE posters (
    titleId TEXT REFERENCES title_basics(tconst) ON DELETE CASCADE,
    posterId TEXT
);

CREATE TABLE title_principals (
    tconst TEXT ,
    ordering INTEGER NOT NULL,
    nconst TEXT ,
    category TEXT NOT NULL,
    job TEXT,
    characters TEXT,
    PRIMARY KEY (tconst, ordering)
);

CREATE TABLE title_ratings (
    tconst TEXT PRIMARY KEY REFERENCES title_basics(tconst) ON DELETE CASCADE,
    averageRating DECIMAL(3,1),
    numVotes INTEGER
);

CREATE INDEX idx_title_basics_genres ON title_basics USING GIN(genres);
CREATE INDEX idx_name_basics_professions ON name_basics USING GIN(primaryProfession);
CREATE INDEX idx_title_akas_region ON title_akas(region);
CREATE INDEX idx_title_episode_parent ON title_episode(parentTconst);
CREATE INDEX idx_title_principals_name ON title_principals(nconst);
