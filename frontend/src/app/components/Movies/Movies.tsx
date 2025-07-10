"use client";

import { Pagination, Stack } from "@mui/material";
import Loading from "./Loading";
import MovieCard from "./MovieCard";
import Sidebar from "./Sidebar/Sidebar";

import { useMovies } from "@/app/hooks/useMovies";
import { useEffect, useState } from "react";
import { Movie } from "@/app/services/MovieService";

const movieCountPerPage = 6

export default function MoviesPage() {
  const { movies } = useMovies();
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  useEffect(() => {

    //GET next movieCountPerPage # of movies

    setDisplayMovies(movies.filter((x) => x.id < page * movieCountPerPage && x.id >= (page - 1) * movieCountPerPage ));
  }, [movies, page])

  return (
    <div
      id="movies-main"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "20px",
        marginBottom: "30px"
      }}
    >
      <Sidebar></Sidebar>
      <Stack>
      <div
        id="movies-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "15px",
          marginBottom: "15px",
          width: "140ch",
          // justifyContent:"center"
        }}
      >
        {movies.length > 0 ? (
          displayMovies.map((movie) => {
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
          <Loading />
        )}
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <Pagination
          variant="outlined"
          shape="rounded"
          count={Math.ceil(movies.length/movieCountPerPage)}
          size="large"
          sx={{mt: 5}}
          page={page}
          onChange={handlePageChange}
        />
      </div>
      </Stack>
    </div>
  );
}
