import { User } from "@/app/services/AuthService";
import * as MovieService from "../../services/MovieService";

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

interface ReviewProps {
  profileUser: User | undefined;
}

export default function Reviews({ profileUser }: ReviewProps) {
  const { user, setUser } = useAuth();

  console.log(user);

  return (
    <Box>
      {profileUser?.reviews.map((movieId) => {
        const movie = MovieService.getMovie(movieId);

        const movieRating = movie?.ratings.find(
          (x) => x.userId === profileUser.id
        );
        return (
          <Card key={movie?.id} sx={{ mb: 2, position: "relative" }}>
            <CardContent
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box sx={{ display: "flex" }}>
                <Avatar
                  src={profileUser?.pfp}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{movie?.title}</Typography>
                  <Rating value={movieRating?.rating} readOnly />
                  {movieRating?.comment && (
                    <Typography variant="body2">
                      {movieRating.comment}
                    </Typography>
                  )}
                </Box>
              </Box>

              {user?.id === profileUser.id && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="contained"
                    sx={{ fontSize: "10px", width: "120px" }}
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
      })}
    </Box>
  );
}
