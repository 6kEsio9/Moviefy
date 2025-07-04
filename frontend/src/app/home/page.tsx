'use client'
import { Container, Divider, Stack } from "@mui/material";
import GenreSelection from "../components/Home/GenreSection";
import { useMovies } from "@/app/hooks/useMovies";

export default function HomePage() {
  const { movies } = useMovies();

  return (
    <Container sx={{ marginTop: "15px", marginBottom: "15px" }}>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" />}
        spacing={2}
      >
        <GenreSelection
          movies={movies}
          genre="Top 10 Movies"
          textColor="black"
          moreRedirect="/movies?order=popular"
        />
        <GenreSelection movies={movies} genre="Action" />
        <GenreSelection movies={movies} genre="Horror" />
        <GenreSelection movies={movies} genre="Comedy" />
      </Stack>
    </Container>
  );
}
