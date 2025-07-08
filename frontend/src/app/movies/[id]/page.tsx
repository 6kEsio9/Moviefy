"use client";
import { Button, Grid } from "@mui/material";
import MovieInfo from "@/app/components/MovieID/MovieInfo";
import WatchlistButtons from "@/app/components/MovieID/WatchlistButtons";
import { getMovie } from "@/app/services/MovieService";
import ReviewList from "@/app/components/MovieID/Reviews/ReviewList";
import Link from "next/link";
import ReviewWriteField from "@/app/components/MovieID/Reviews/ReviewWriteField";
import { useParams } from "next/navigation";

export default function MovieDetails() {
  const movie = getMovie(+useParams().id!)!;

  return (
    <Grid
      container
      spacing={5}
      direction={"column"}
      sx={{
        marginTop: "40px",
        marginBottom: "15px",
        marginRight: "10%",
        marginLeft: "10%",
      }}
    >
      <MovieInfo movie={movie} />

      <WatchlistButtons />

      <ReviewList reviews={movie.reviews} />

      <ReviewWriteField />

      <Link
        style={{ alignSelf: "center", textDecoration: "none" }}
        href={`/movies/${movie.id}/reviews`}
      >
        <Button variant="contained">See all reviews</Button>
      </Link>
    </Grid>
  );
}
