CREATE TABLE "name_basics" (
  "nconst" string PRIMARY KEY,
  "primaryName" string,
  "birthYear" number,
  "deathYear" number,
  "primaryProfession" string_array,
  "knownForTitles" nconst_array
);

CREATE TABLE "title_basics" (
  "tconst" string PRIMARY KEY,
  "titleType" string,
  "primaryTitle" string,
  "originalTitle" string,
  "isAdult" boolean,
  "startYear" number,
  "endYear" number,
  "runtimeMinutes" number,
  "genres" string_array
);

CREATE TABLE "title_akas" (
  "titleId" string,
  "ordering" integer,
  "title" string,
  "region" string,
  "language" string,
  "types" string_array,
  "attributes" string_array,
  "isOriginalTitle" boolean
);

CREATE TABLE "title_crew" (
  "tconst" string,
  "directors" nconst_array,
  "writers" nconst_array
);

CREATE TABLE "title_episode" (
  "tconst" string PRIMARY KEY,
  "parentTconst" string,
  "seasonNumber" number,
  "episodeNumber" number
);

CREATE TABLE "title_principals" (
  "tconst" string,
  "ordering" number,
  "nconst" string,
  "category" string,
  "job" string,
  "characters" string
);

CREATE TABLE "title_ratings" (
  "tconst" string,
  "averageRating" number,
  "numVotes" number
);

ALTER TABLE "title_basics" ADD FOREIGN KEY ("tconst") REFERENCES "name_basics" ("knownForTitles");

ALTER TABLE "title_akas" ADD FOREIGN KEY ("titleId") REFERENCES "title_basics" ("tconst");

ALTER TABLE "title_crew" ADD FOREIGN KEY ("tconst") REFERENCES "title_basics" ("tconst");

ALTER TABLE "title_crew" ADD FOREIGN KEY ("directors") REFERENCES "name_basics" ("nconst");

ALTER TABLE "title_crew" ADD FOREIGN KEY ("writers") REFERENCES "name_basics" ("nconst");

ALTER TABLE "title_episode" ADD FOREIGN KEY ("parentTconst") REFERENCES "title_basics" ("tconst");

ALTER TABLE "title_principals" ADD FOREIGN KEY ("tconst") REFERENCES "title_basics" ("tconst");

ALTER TABLE "title_principals" ADD FOREIGN KEY ("nconst") REFERENCES "name_basics" ("nconst");

ALTER TABLE "title_ratings" ADD FOREIGN KEY ("tconst") REFERENCES "title_basics" ("tconst");
