import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Movie } from "@/app/services/MovieService";
import { useAuth } from "@/app/hooks/useAuth";
import { useMovies } from "@/app/hooks/useMovies";

interface EditReviewsProps {
  comment: string | undefined;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  movie: Movie;
}

export default function EditReviews({
  comment,
  setEdit,
  movie,
}: EditReviewsProps) {
  const { user } = useAuth();
  const { movies, setMovies } = useMovies();

  const onSubmitHandler = (event: any) => {
    event?.preventDefault();

    const newComment = event.currentTarget[0].value;
    const updatedReviews = movie?.reviews.map((review) => {
      if (review.userId === user?.id) {
        return { ...review, comment: newComment };
      }
      return review;
    });

    const updatedMovie = { ...movie, reviews: updatedReviews };

    const newMovies = movies.map((x) => (x.id === movie.id ? updatedMovie : x));

    setMovies(newMovies);
    setEdit(false);
    //fetch...
  };

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        defaultValue={comment}
      />
    </Box>
  );
}
