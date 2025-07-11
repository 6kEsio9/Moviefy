import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Movie, ReviewMovie } from "@/app/services/MovieService";
import { useAuth } from "@/app/hooks/useAuth";
import * as MovieService from "../../../services/MovieService";

interface EditReviewsProps {
  comment: string | undefined;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  movie: Movie;
  setReviews: React.Dispatch<React.SetStateAction<ReviewMovie[]>>;
  review: ReviewMovie;
}

export default function EditReviews({
  comment,
  setEdit,
  movie,
  setReviews,
  review,
}: EditReviewsProps) {
  const { user } = useAuth();

  const authToken = localStorage.getItem("user");

  const onSubmitHandler = (event: any) => {
    event?.preventDefault();

    const newComment = event.currentTarget[0].value;

    const fetched = async () => {
      await MovieService.editReview(
        user?.id!,
        movie.id,
        newComment,
        authToken!
      );
    };
    fetched();

    setReviews((prevReviews) =>
      prevReviews?.map((r) =>
        r.userId === review.userId ? { ...r, comment: newComment } : r
      )
    );

    setEdit(false);
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
