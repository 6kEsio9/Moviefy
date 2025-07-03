"use client";

import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import Sidebar from "./Sidebar/Sidebar";

type Movie = {
  id: number;
  title: string;
  imageUrl: string;
  year: number;
  avgRating: number;
  genre: string;
  ageRating: number;
};

export default function MoviesPage() {
  const [originalMovies, setOriginalMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setMovies([
      {
        id: 0,
        title: "Tennet",
        imageUrl: "/images/tennet.jpeg",
        year: 2005,
        avgRating: 5,
        genre: "Action",
        ageRating: 16,
      },
      {
        id: 1,
        title: "Cars",
        imageUrl: "/images/cars.jpeg",
        year: 2010,
        avgRating: 4,
        genre: "Fantasy",
        ageRating: 3,
      },
      {
        id: 2,
        title: "Game Of Thrones",
        imageUrl: "/images/gameOfThrones.jpeg",
        year: 2015,
        avgRating: 2,
        genre: "Fantasy",
        ageRating: 18,
      },
      {
        id: 3,
        title: "Inglourious Basterds",
        imageUrl: "/images/inglouriousBasterds.jpeg",
        year: 2009,
        avgRating: 1,
        genre: "Comedy",
        ageRating: 16,
      },
      {
        id: 4,
        title: "Interstellar",
        imageUrl: "/images/interstellar.jpeg",
        year: 2004,
        avgRating: 3,
        genre: "Sci-Fi",
        ageRating: 12,
      },
      {
        id: 5,
        title: "Star Wars",
        imageUrl: "/images/starWars.jpeg",
        year: 1999,
        avgRating: 4,
        genre: "Sci-Fi",
        ageRating: 12,
      },
      {
        id: 6,
        title: "Taxi",
        imageUrl: "/images/taxi.jpeg",
        year: 2012,
        avgRating: 5,
        genre: "Comedy",
        ageRating: 12,
      },
    ]);
    setOriginalMovies([
      {
        id: 0,
        title: "Tennet",
        imageUrl: "/images/tennet.jpeg",
        year: 2005,
        avgRating: 5,
        genre: "Action",
        ageRating: 16,
      },
      {
        id: 1,
        title: "Cars",
        imageUrl: "/images/cars.jpeg",
        year: 2010,
        avgRating: 4,
        genre: "Fantasy",
        ageRating: 3,
      },
      {
        id: 2,
        title: "Game Of Thrones",
        imageUrl: "/images/gameOfThrones.jpeg",
        year: 2015,
        avgRating: 2,
        genre: "Fantasy",
        ageRating: 18,
      },
      {
        id: 3,
        title: "Inglourious Basterds",
        imageUrl: "/images/inglouriousBasterds.jpeg",
        year: 2009,
        avgRating: 1,
        genre: "Comedy",
        ageRating: 16,
      },
      {
        id: 4,
        title: "Interstellar",
        imageUrl: "/images/interstellar.jpeg",
        year: 2004,
        avgRating: 3,
        genre: "Sci-Fi",
        ageRating: 12,
      },
      {
        id: 5,
        title: "Star Wars",
        imageUrl: "/images/starWars.jpeg",
        year: 1999,
        avgRating: 4,
        genre: "Sci-Fi",
        ageRating: 12,
      },
      {
        id: 6,
        title: "Taxi",
        imageUrl: "/images/taxi.jpeg",
        year: 2012,
        avgRating: 5,
        genre: "Comedy",
        ageRating: 12,
      },
    ]);
  }, []);

  useEffect(() => {
    return () => {
      setMovies(originalMovies);
    };
  }, []);

  const handleClickPopular = () => {
    let result = [...movies];

    result.sort((a, b) => {
      if (a.avgRating === b.avgRating) {
        return a.title.localeCompare(b.title);
      } else {
        return b.avgRating - a.avgRating;
      }
    });

    setMovies(result);
  };

  const handleClickGenre = (genre: string) => {
    let result = [...originalMovies];

    result = result.filter((x) => x.genre === genre);

    setMovies(result);
  };

  const handleClickYear = (year: string) => {
    let result = [...movies];

    result.sort((a, b) => {
      if (a.year === b.year) return a.title.localeCompare(b.title);
      if (year === "Oldest") {
        return a.year - b.year;
      } else {
        return b.year - a.year;
      }
    });

    setMovies(result);
  };

  const handleClickAge = (age: string) => {
    let result = [...originalMovies];
    result = result.filter((x) => {
      if (age === ">18") {
        return x.ageRating >= 18;
      } else {
        return x.ageRating < 18;
      }
    });

    setMovies(result);
  };

  return (
    <>
      <div
        id="movies-main"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <Sidebar
          handleClickPopular={handleClickPopular}
          handleClickGenre={handleClickGenre}
          handleClickYear={handleClickYear}
          handleClickAge={handleClickAge}
        ></Sidebar>
        <div id="movies-sidebar"></div>
        <div
          id="movies-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "15px",
            marginBottom: "15px",
            width: "140ch", //1300px, 140ch
          }}
        >
          {movies.length > 0 ? (
            movies.map((movie) => {
              return (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  imageUrl={movie.imageUrl}
                />
              );
            })
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      </div>
    </>
  );
}
