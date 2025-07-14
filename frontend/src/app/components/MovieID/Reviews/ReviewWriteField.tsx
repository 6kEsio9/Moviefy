"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { Movie } from "@/app/services/MovieService";
import {
  Alert,
  Box,
  Button,
  Container,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as ms from "@/app/services/MovieService";

interface ReviewWriteFieldProps {
  movie: Movie;
  setMovie: React.Dispatch<React.SetStateAction<Movie | undefined>>;
}

export default function ReviewWriteField({ movie, setMovie }: ReviewWriteFieldProps) {
  const { user } = useAuth();
  const authToken = localStorage.getItem("user");

  const [shouldRender, setShouldRender] = useState(false);
  const [rating, setRating] = useState<number | null>(0)
  const [showRatingError, setShowRatingError] = useState(false)

  const handlePost = (formData: FormData) => {
    const reviewText = formData.get("reviewText")?.toString() || ""
    if(!rating){
      setShowRatingError(true);
      return;
    }

    const newReview: ms.ReviewMovie = {
      userId: user!.id,
      rating: rating,
      comment: reviewText,
      likes: []
    }

    setMovie((prevMovie) => {
      return {...prevMovie!, reviews: [...prevMovie!.reviews, newReview]}
    });

    const fetched = async () => {
      await ms.rate(user!.id, movie.id, rating, reviewText)
    };
    fetched();
    
    setShouldRender(false);
  }

  useEffect(() => {
    const userIndex = movie?.reviews.findIndex((x) => x.userId === user?.id);

    if (userIndex! === -1) {
      setShouldRender(true);
    }
  }, []);

  return (
    <Container>
      {shouldRender ? (
        <Box component="form" action={handlePost}>
          <Typography variant="h5" color="gray">
            {user === null ? "Sign in to write a review" : "Write a review"}
          </Typography>
          {showRatingError && <Alert severity="error">Review must have a rating</Alert>}
          <Rating 
            value={rating}
            onChange={(e, newValue) => {
              setRating(newValue);
              setShowRatingError(false)
            }}
            disabled={user === null}
          />
          <TextField name="reviewText" fullWidth multiline disabled={user === null} rows={5} />
          <Button
            type="submit"
            variant="contained"
            disabled={user === null}
            sx={{ mt: 2 }}
          >
            Post
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Container>
  );
}
