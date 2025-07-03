import { Container, Divider, Stack } from "@mui/material";
import GenreSelection from "../components/Home/GenreSection";

export default function HomePage() {
  //for testing
  const images = [
    {
      title: "Title",
      src: "https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      id: 1,
    },
    {
      title: "Title",
      src: "https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      id: 2,
    },
    {
      title: "Title",
      src: "https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      id: 3,
    },
    {
      title: "Title",
      src: "https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      id: 4,
    },
    {
      title: "Title",
      src: "https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      id: 5,
    },
    {
      title: "Title",
      src: "https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      id: 6,
    },
  ];

  return (
    <Container sx={{ marginTop: "15px", marginBottom: "15px" }}>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" />}
        spacing={2}
      >
        <GenreSelection
          images={images}
          genre="Top 10 Movies"
          textColor="black"
          moreRedirect="/movies?order=popular"
        />
        <GenreSelection images={images} genre="Action" />
        <GenreSelection images={images} genre="Horror" />
        <GenreSelection images={images} genre="Comedy" />
      </Stack>
    </Container>
  );
}
