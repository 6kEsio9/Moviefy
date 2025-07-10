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
import Link from "next/link";

interface ReviewProps {
  movie: Movie;
  profileUser: User | undefined;
}

export default function Review({ movie, profileUser }: ReviewProps) {
  const { user, setUser } = useAuth();
  const [edit, setEdit] = useState(false);

  const movieRating = movie?.reviews.find((x) => x.userId === profileUser?.id);
  
  const handleRemove = () => {
    let updatedReviews = user!.reviews;
    updatedReviews = updatedReviews!.filter((x) => x !== movie.id);
    const updatedUser = {...user!, reviews: updatedReviews};
    setUser(updatedUser);

    //POST remove review from movie
  }

  return (
    <Card key={movie?.id} sx={{ mb: 2, position: "relative" }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <Avatar
            src={user?.id === profileUser?.id ? user?.pfp : profileUser?.pfp}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Link
              href={`/movies/${movie.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Typography variant="h6">{movie?.title}</Typography>
            </Link>
            <Rating value={movieRating?.rating} readOnly />
            {edit ? (
              <EditReviews
                comment={movieRating?.comment}
                setEdit={setEdit}
                movie={movie}
              />
            ) : (
              <Typography variant="body2">{movieRating?.comment}</Typography>
            )}
          </Box>
        </Box>

        {user?.id === profileUser?.id && (
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
              onClick={handleRemove}
            >
              Remove
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
