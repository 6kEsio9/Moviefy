"use client";

import { useEffect, useState } from "react";
import Loading from "./Loading";
import MovieCard from "./MovieCard";
import Sidebar from "./Sidebar/Sidebar";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "../../services/MovieService";
import { Pagination, Stack } from "@mui/material";
import { useAuth } from "@/app/hooks/useAuth";
import { getReviews } from "@/app/services/AuthService";

const movieCountPerPage = 21;

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>();
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const [userReviews, setUserReviews] = useState([])
  const [filter, setFilter] = useState<MovieService.MovieFilers>({ genre: "", isAdult: false, year: false})
  

  useEffect(() => {
    const fetched = async () => {
      const res = await MovieService.getAll(movieCountPerPage, (page - 1) * movieCountPerPage);
      // const res = await MovieService.filterMovies(filter, movieCountPerPage, (page - 1) * movieCountPerPage)
      setMovies(res.data as Movie[]);
    };
    fetched();
  }, [page]);

  useEffect(() => {
    if(!user) return;
    const fetched = async () => {
      const res = await getReviews(user?.id);
      setUserReviews(res.data)
    };
    fetched();
  }, [])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

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
      {movies && <Sidebar setFilter={setFilter} />}

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
              return <MovieCard key={movie.id} movie={movie} userReviews={userReviews} />;
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
              count={100}
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
