"use client";

import { useEffect, useState } from "react";
import Loading from "./Loading";
import MovieCard from "./MovieCard";
import Sidebar from "./Sidebar/Sidebar";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "../../services/MovieService";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>();

  useEffect(() => {
    const fetched = async () => {
      const res = await MovieService.getAll();
      setMovies(res);
    };
    fetched();
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
          {movies && movies.length > 0 ? (
            movies.map((movie) => {
              return <MovieCard key={movie.id} movie={movie} movies={movies} />;
            })
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
}
