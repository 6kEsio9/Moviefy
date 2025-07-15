"use client";
import { Container, Divider, Stack } from "@mui/material";
import GenreSelection from "../components/Home/GenreSection";

import { useEffect, useState } from "react";
import { Movie } from "../services/MovieService";
import * as MovieService from "../services/MovieService";
import { getGenreList } from "../services/MovieService";

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>();

  const genreList = ["Action", "Comedy", "Sci-Fi"];

  useEffect(() => {
    const fetched = async () => {
      const res = await MovieService.getAll();
      setMovies(res.data);
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

            {genreList.map((x) => (
              <GenreSelection key={x} movies={movies} genre={x} />
            ))}
          </>
        )}
      </Stack>
    </Container>
  );
}
