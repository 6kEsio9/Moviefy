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

interface ReviewProps {
  currentUser: User | undefined;
  profileUser: User | undefined;
}

export default function Reviews({ currentUser, profileUser }: ReviewProps) {
  return (
    <Box>
      {profileUser?.reviews.map((movieId) => {
        const movie = MovieService.getMovie(movieId);

        console.log(movie);

        const movieRating = movie?.ratings.find(
          (x) => x.userId === profileUser.id
        );
        return (
          <Card key={movie?.id} sx={{ mb: 2 }}>
            <CardContent>
              <Avatar
                src={profileUser?.pfp}
                sx={{ width: 60, height: 60, mb: 2, position: "absolute" }}
              />
              <div style={{ marginLeft: "10ch" }}>
                <Typography variant="h6">{movie?.title}</Typography>
                <Rating value={movieRating?.rating} readOnly />
                {movieRating?.comment && (
                  <Typography variant="body2">
                    {movieRating?.comment}
                  </Typography>
                )}
              </div>
            </CardContent>
            {currentUser?.id === profileUser.id && (
              <div>
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
              </div>
            )}
          </Card>
        );
      })}
    </Box>
  );
}
