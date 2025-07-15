INSERT INTO posters(titleId)
SELECT tconst FROM title_basics;

CREATE TABLE user_rating (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  filmId TEXT REFERENCES title_basics(tconst) ON DELETE CASCADE,
  rating REAL CHECK (rating BETWEEN 1 AND 5),
  UNIQUE (userId, filmId)
);

