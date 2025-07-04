'use client'
import { Container, Divider, Grid, Typography } from "@mui/material";
import Review from "@/app/components/MovieID/Review";
import MovieInfo from "@/app/components/MovieID/MovieInfo";
import WatchlistButtons from "@/app/components/MovieID/WatchlistButtons";
import { getMovieId } from "@/app/components/MovieID/GetIdFromUrl";
import { getMovie } from "@/app/services/MovieService";


export default function MovieDetails() {
  const movie = getMovie(getMovieId())!

  return(
    <Grid container direction={"column"} sx={{marginTop: "40px", marginBottom: "15px"}}>
      <MovieInfo movie={movie}/>

      <WatchlistButtons/>

      <Grid>
        <Container sx={{marginTop: 5, marginBottom: 5}}>
          <Typography variant="h4" marginBottom={3}>Reviews</Typography>

          <Grid container direction={"column"} spacing={3}>
            {movie.ratings.map((review) => {
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
