import { Box, Container, Divider, Stack, Typography, Grid, Link } from "@mui/material"
import ScrollableImageList from "./ScrollableImageList";

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
    }
  ]

  return (
    <Container>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal"/>}
        spacing={2}
      >
        <Box>
          <Typography variant="h5">Top 10 Movies</Typography>
          <ScrollableImageList images={images}/>
        </Box>
        <Grid container spacing={2}>
            <Typography variant="h5" sx={{color:'GrayText'}}>Action</Typography>
            <Link href="/movies" underline="none">
              <Typography>{"MORE"}</Typography>
            </Link>
            <ScrollableImageList images={images}/>
        </Grid>
        <Box>
            <Typography variant="h5" sx={{color:'GrayText'}}>Horror</Typography>
            <ScrollableImageList images={images}/>
        </Box>
        <Box>
            <Typography variant="h5" sx={{color:'GrayText'}}>Comedy</Typography>
            <ScrollableImageList images={images}/>
        </Box>
      </Stack>
    </Container>
  )
}
