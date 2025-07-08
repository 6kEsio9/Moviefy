import { User } from "@/app/services/AuthService";
import * as MovieService from "../../../services/MovieService";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Rating,
  Typography,
} from "@mui/material";
import { useAuth } from "@/app/hooks/useAuth";
import { useMovies } from "@/app/hooks/useMovies";
import { useState } from "react";
import EditReviews from "./EditReviews";
import Review from "./Review";

interface ReviewProps {
  profileUser: User | undefined;
}

export default function Reviews({ profileUser }: ReviewProps) {
  return (
    <Box>
      {profileUser?.reviews.map((movieId) => {
        const movie = MovieService.getMovie(movieId);

        return (
          <Review key={movieId} movie={movie!} profileUser={profileUser} />
        );
      })}
    </Box>
  );
}
