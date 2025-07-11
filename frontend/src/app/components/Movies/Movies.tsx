"use client";

import { useEffect, useState } from "react";
import Loading from "./Loading";
import MovieCard from "./MovieCard";
import Sidebar from "./Sidebar/Sidebar";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "../../services/MovieService";
import { Pagination, Stack } from "@mui/material";

const movieCountPerPage = 6;

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>();
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetched = async () => {
      const res = await MovieService.getAll();
      setMovies(res);
    };
    fetched();
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  useEffect(() => {
    //GET next movieCountPerPage # of movies
    // setDisplayMovies(movies.filter((x) => x.id < page * movieCountPerPage && x.id >= (page - 1) * movieCountPerPage ));
  }, [movies, page, movieCountPerPage]);

  return (
    <div
      id="movies-main"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      <Sidebar />

      <Stack>
        <div
          id="movies-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "15px",
            marginBottom: "15px",
            width: "140ch",
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
        {movies && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              variant="outlined"
              shape="rounded"
              count={Math.ceil(movies.length / movieCountPerPage)}
              size="large"
              sx={{ mt: 5 }}
              page={page}
              onChange={handlePageChange}
            />
          </div>
        )}
      </Stack>
    </div>
  );
}
