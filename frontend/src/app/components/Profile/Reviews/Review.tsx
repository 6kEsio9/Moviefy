import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Rating,
  Button,
} from "@mui/material";
import EditReviews from "./EditReviews";
import { Movie } from "@/app/services/MovieService";
import { User } from "@/app/services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";

interface ReviewProps {
  movie: Movie;
  profileUser: User;
}

export default function Review({ movie, profileUser }: ReviewProps) {
  const { user, setUser } = useAuth();
  const [edit, setEdit] = useState(false);

  const movieRating = movie?.reviews.find((x) => x.userId === profileUser.id);

  return (
    <Card key={movie?.id} sx={{ mb: 2, position: "relative" }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <Avatar
            src={profileUser?.pfp}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{movie?.title}</Typography>
            <Rating value={movieRating?.rating} readOnly />
            {edit ? (
              <EditReviews comment={movieRating?.comment} setEdit={setEdit} />
            ) : (
              <Typography variant="body2">{movieRating?.comment}</Typography>
            )}
          </Box>
        </Box>

        {user?.id === profileUser.id && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              sx={{ fontSize: "10px", width: "120px" }}
              onClick={() => setEdit(!edit)}
            >
              Edit comment
            </Button>
            <Button
              variant="outlined"
              sx={{ fontSize: "10px", width: "120px" }}
            >
              Remove
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
