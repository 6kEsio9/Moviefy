"use client";

import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import Sidebar from "./Sidebar/Sidebar";

import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  imageUrl: string;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setMovies([
      { id: 0, title: "Tennet", imageUrl: "/images/tennet.jpeg" },
      { id: 1, title: "Tennet", imageUrl: "/images/tennet.jpeg" },
      { id: 2, title: "Tennet", imageUrl: "/images/tennet.jpeg" },
      { id: 3, title: "Tennet", imageUrl: "/images/tennet.jpeg" },
      { id: 4, title: "Tennet", imageUrl: "/images/tennet.jpeg" },
    ]);
  }, []);

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
        <Sidebar></Sidebar>
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
                <Link
                  href={`/movies/${movie.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <MovieCard
                    key={movie.id}
                    title={movie.title}
                    imageUrl={movie.imageUrl}
                  />
                </Link>
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
