import { Container, Divider, Stack} from "@mui/material"
import GenreSelection from "./GenreSection"

export default function HomePage() {
  //for testing
  const images = [
    {
      src: 'https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      id: 1
    },
    {
      src: 'https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      id: 2
    },
    {
      src: 'https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      id: 3
    },
    {
      src: 'https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      id: 4
    },
    {
      src: 'https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      id: 5
    },
    {
      src: 'https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      id: 6
    },
  ]

  return (
    <Container>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal"/>}
        spacing={2}
      >
        <GenreSelection images={images} genre="Top 10 Movies" textColor="black" moreRedirect="/movies?order=popular"/>
        <GenreSelection images={images} genre="Action"/>
        <GenreSelection images={images} genre="Horror"/>
        <GenreSelection images={images} genre="Comedy"/>
      </Stack>
    </Container>
  )
}
