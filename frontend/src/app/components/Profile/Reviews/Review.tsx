import React, { useState } from "react";
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
import { ReviewUser, UserProfile } from "@/app/services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";

interface ReviewProps {
  review: ReviewUser;
  profileUser: UserProfile | undefined;
  setReviews: React.Dispatch<React.SetStateAction<ReviewUser[] | undefined>>;
}

export default function Review({
  review,
  profileUser,
  setReviews,
}: ReviewProps) {
  const { user } = useAuth();
  const [edit, setEdit] = useState(false);

  return (
    <Card sx={{ mb: 2, position: "relative" }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <Avatar
            src={profileUser?.pfp}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Link
              href={`/movies/${review.movieId}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Typography variant="h6">{review.movieTitle}</Typography>
            </Link>
            <Rating value={review.rating} readOnly />
            {edit ? (
              <EditReviews
                comment={review.comment}
                setEdit={setEdit}
                review={review}
                setReviews={setReviews}
              />
            ) : (
              <Typography variant="body2">{review.comment}</Typography>
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
            >
              Remove
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
