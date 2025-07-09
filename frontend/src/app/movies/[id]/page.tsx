"use client";
import { Button, Grid } from "@mui/material";
import MovieInfo from "@/app/components/MovieID/MovieInfo";
import WatchlistButtons from "@/app/components/MovieID/WatchlistButtons";
import ReviewList from "@/app/components/MovieID/Reviews/ReviewList";
import Link from "next/link";
import ReviewWriteField from "@/app/components/MovieID/Reviews/ReviewWriteField";
import { useParams } from "next/navigation";
import { useMovies } from "@/app/hooks/useMovies";
import { useEffect, useState } from "react";
import { Movie } from "@/app/services/MovieService";
import Loading from "@/app/components/Movies/Loading";

export default function MovieDetails() {
  const { movies } = useMovies();

  const movieId = Number(useParams().id);

  const movie = movies.find((x) => x.id === movieId);

  return movie ? (
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
      <MovieInfo movie={movie!} />

      <WatchlistButtons />

      <ReviewList reviews={movie!.reviews} />

      <ReviewWriteField />

      <Link
        style={{ alignSelf: "center", textDecoration: "none" }}
        href={`/movies/${movie!.id}/reviews`}
      >
        <Button variant="contained">See all reviews</Button>
      </Link>
    </Grid>
  ) : (
    <Loading />
  );
}
