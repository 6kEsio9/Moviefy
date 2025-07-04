'use client'
import { Container, Divider, Grid, IconButton, Typography } from "@mui/material";
import Review from "@/app/components/MovieID/Review";
import MovieInfo from "@/app/components/MovieID/MovieInfo";
import WatchlistButtons from "@/app/components/MovieID/WatchlistButtons";

//testing data
const td = { 
  title: "F1",
  year: 2025,
  director: "John Doe",
  cast: ["Brad Pitt", "Damson Idris"],
  crew: ["Adam Adam", "John John"],
  poster: 'https://a.ltrbxd.com/resized/film-poster/8/1/7/9/7/7/817977-f1-the-movie-0-1000-0-1500-crop.jpg?v=f5ae2b99b9',
  summary: "Racing legend Sonny Hayes is coaxed out of retirement to lead a struggling Formula 1 team—and mentor a young hotshot driver—while chasing one more chance at glory."
}

const tr = [
  {
    username: "isadksa",
    pfp: "https://a.ltrbxd.com/resized/avatar/upload/1/9/4/2/8/0/5/7/shard/avtr-0-144-0-144-crop.jpg?v=dad83a2711",
    rating: 3,
    review: "idk",
    likes: 1012
  },
  {
    username: "sajfls",
    pfp: "https://a.ltrbxd.com/resized/avatar/upload/1/9/4/2/8/0/5/7/shard/avtr-0-144-0-144-crop.jpg?v=dad83a2711",
    rating: 5,
    review: "idk",
    likes: 1012
  },
  {
    username: "l;sa,kf alk f",
    pfp: "https://a.ltrbxd.com/resized/avatar/upload/1/9/4/2/8/0/5/7/shard/avtr-0-144-0-144-crop.jpg?v=dad83a2711",
    rating: 4,
    review: "idk",
    likes: 1012
  },
  
]


export default function MovieDetails() {
  return(
    <Grid container direction={"column"} sx={{marginTop: "40px", marginBottom: "15px"}}>
      <MovieInfo movie={td}/>

      <WatchlistButtons/>

      <Grid>
        <Container sx={{marginTop: 5, marginBottom: 5}}>
          <Typography variant="h4" marginBottom={3}>Reviews</Typography>

          <Grid container direction={"column"} spacing={3}>
            {tr.map((review) => {
              return(
                <div>
                  <Divider orientation="horizontal"/>
                  <Review review={review}/>
                </div>
              )
            })}
          </Grid>
        </Container>
      </Grid>
    </Grid> 
  )
}
