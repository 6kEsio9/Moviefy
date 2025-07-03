"use client";

import MovieCard from "./MovieCard";
import Sidebar from "./Sidebar/Sidebar";

import { useMovies } from "@/app/hooks/useMovies";

export default function MoviesPage() {
  const { movies } = useMovies();

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
