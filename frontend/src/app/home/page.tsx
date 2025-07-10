"use client";
import { Container, Divider, Stack } from "@mui/material";
import GenreSelection from "../components/Home/GenreSection";
import { useEffect, useState } from "react";
import { Movie } from "../services/MovieService";
import * as MovieService from "../services/MovieService";

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>();

  useEffect(() => {
    const fetched = async () => {
      const res = await MovieService.getAll();
      setMovies(res);
    };
    fetched();
  }, []);

  return (
    <Container sx={{ marginTop: "15px", marginBottom: "15px" }}>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" />}
        spacing={2}
      >
        {movies && (
          <>
            <GenreSelection
              movies={movies}
              genre="Top 10 Movies"
              textColor="black"
              moreRedirect="/movies?order=popular"
            />
            <GenreSelection movies={movies} genre="Action" />
            <GenreSelection movies={movies} genre="Horror" />
            <GenreSelection movies={movies} genre="Comedy" />
          </>
        )}
      </Stack>
    </Container>
  );
}
