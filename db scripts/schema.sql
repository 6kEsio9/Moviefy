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
    genres TEXT[]
);

CREATE TABLE name_basics (
    nconst TEXT PRIMARY KEY,
    primaryName TEXT NOT NULL,
    birthYear INTEGER ,
    deathYear INTEGER ,
    primaryProfession TEXT[],
    knownForTitles TEXT[]
);

CREATE TABLE title_akas (
    titleId TEXT REFERENCES title_basics(tconst) ON DELETE CASCADE,
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
    tconst TEXT PRIMARY KEY REFERENCES title_basics(tconst) ON DELETE CASCADE,
    directors TEXT[] ,
    writers TEXT[]
);

CREATE TABLE title_episode (
    tconst TEXT PRIMARY KEY REFERENCES title_basics(tconst) ON DELETE CASCADE,
    parentTconst TEXT REFERENCES title_basics(tconst) ON DELETE CASCADE,
    seasonNumber INTEGER NOT NULL ,
    episodeNumber INTEGER NOT NULL
);

CREATE TABLE posters (
    titleId TEXT REFERENCES title_basics(tconst) ON DELETE CASCADE,
    posterId TEXT
);

CREATE TABLE title_principals (
    tconst TEXT REFERENCES title_basics(tconst) ON DELETE CASCADE,
    ordering INTEGER NOT NULL,
    nconst TEXT REFERENCES name_basics(nconst) ON DELETE CASCADE,
    category TEXT NOT NULL,
    job TEXT,
    characters TEXT,
    PRIMARY KEY (tconst, ordering)
);

CREATE TABLE title_ratings (
    tconst TEXT PRIMARY KEY REFERENCES title_basics(tconst) ON DELETE CASCADE,
    averageRating INTEGER,
    numVotes INTEGER
);

CREATE INDEX idx_title_basics_genres ON title_basics USING GIN(genres);
CREATE INDEX idx_name_basics_professions ON name_basics USING GIN(primaryProfession);
CREATE INDEX idx_title_akas_region ON title_akas(region);
CREATE INDEX idx_title_episode_parent ON title_episode(parentTconst);
CREATE INDEX idx_title_principals_name ON title_principals(nconst);
