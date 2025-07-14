import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ReviewUser } from "@/app/services/AuthService";
import * as AuthService from "../../../services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";

interface EditReviewsProps {
  comment: string | undefined;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  review: ReviewUser;
  setReviews: React.Dispatch<React.SetStateAction<ReviewUser[] | undefined>>;
}

export default function EditReviews({
  comment,
  setEdit,
  review,
  setReviews,
}: EditReviewsProps) {
  const { user } = useAuth();
  const authToken = localStorage.getItem("user");

  const onSubmitHandler = (event: any) => {
    event?.preventDefault();
    const newComment = event.currentTarget[0].value;

    setReviews((prevReviews) =>
      prevReviews?.map((r) =>
        r.movieId === review.movieId ? { ...r, comment: newComment } : r
      )
    );

    setEdit(false);
    const fetched = async () => {
      await AuthService.editReview(review.id, newComment);
    };
    fetched();
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
