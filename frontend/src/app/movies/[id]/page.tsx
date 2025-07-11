"use client";
import { Button, Grid } from "@mui/material";
import MovieInfo from "@/app/components/MovieID/MovieInfo";
import ReviewList from "@/app/components/MovieID/Reviews/ReviewList";
import Link from "next/link";
import ReviewWriteField from "@/app/components/MovieID/Reviews/ReviewWriteField";
import { useParams } from "next/navigation";
import Loading from "@/app/components/Movies/Loading";
import { useEffect, useState } from "react";
import { Movie } from "@/app/services/MovieService";
import * as MovieSerivce from "../../services/MovieService";
import { useAuth } from "@/app/hooks/useAuth";
import WatchlistButtons from "@/app/components/MovieID/WatchlistButtons";

export default function MovieDetails() {
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie>();

  const movieId = useParams().id;

  useEffect(() => {
    const fetched = async () => {
      const result = await MovieSerivce.getMovie(String(movieId!));
      setMovie(result);
    };
    fetched();
  }, []);

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
      <MovieInfo movie={movie} />

      {user && <WatchlistButtons movie={movie} />}

      <ReviewList movie={movie} setMovie={setMovie} />

      <ReviewWriteField movie={movie} />

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
