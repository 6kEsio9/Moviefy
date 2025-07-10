"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { Movie } from "@/app/services/MovieService";
import {
  Box,
  Button,
  Container,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as MovieService from "../../../services/MovieService";

export default function ReviewWriteField() {
  const { user } = useAuth();
  const movieId = useParams().id?.toString();
  const [shouldRender, setShouldRender] = useState(false);
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    const fetched = async () => {
      const res = await MovieService.getMovie(movieId!);
      setMovie(res);
    };
    fetched();
  }, []);

  useEffect(() => {
    const userIndex = movie?.reviews.findIndex((x) => x.userId === user?.id);

    if (userIndex! > -1) {
      setShouldRender(true);
    }
  }, []);

  return (
    <Container>
      {shouldRender ? (
        <Box>
          <Typography variant="h5" color="gray">
            {user === null ? "Sign in to write a review" : "Write a review"}
          </Typography>
          <Rating disabled={user === null} />
          <TextField fullWidth multiline disabled={user === null} rows={5} />
          <Button variant="contained" disabled={user === null} sx={{ mt: 2 }}>
            Post
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Container>
  );
}
