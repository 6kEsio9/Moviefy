'use client'
import { Container, Divider, Stack } from "@mui/material";
import GenreSelection from "../components/Home/GenreSection";
import { useMovies } from "@/app/hooks/useMovies";
import { getGenreList } from "../services/MovieService";

export default function HomePage() {
  const { movies } = useMovies();
  const genreList = getGenreList();

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
          dontFilter
        />
        {genreList.map((x) => (
          <GenreSelection movies={movies} genre={x}/>
        ))}
      </Stack>
    </Container>
  );
}
