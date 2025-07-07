"use client";
import { Button, Grid } from "@mui/material";
import MovieInfo from "@/app/components/MovieID/MovieInfo";
import WatchlistButtons from "@/app/components/MovieID/WatchlistButtons";
import { getMovieId } from "@/app/components/MovieID/GetIdFromUrl";
import { getMovie } from "@/app/services/MovieService";
import ReviewList from "@/app/components/MovieID/Reviews/ReviewList";
import Link from "next/link";

export default function MovieDetails() {
  const movie = getMovie(getMovieId())!;

  return (
    <Grid
      container
      direction={"column"}
      sx={{
        marginTop: "40px",
        marginBottom: "15px",
        marginRight: "5%",
        marginLeft: "10%",
      }}
    >
      <MovieInfo movie={movie} />

      <WatchlistButtons />

      <ReviewList ratings={movie.ratings} />

      <Link
        style={{ alignSelf: "center", textDecoration: "none" }}
        href={`/movies/${movie.id}/reviews`}
      >
        <Button variant="contained">See all reviews</Button>
      </Link>
    </Grid>
  );
}
