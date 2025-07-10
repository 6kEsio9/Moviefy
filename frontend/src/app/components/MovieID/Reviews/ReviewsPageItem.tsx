import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Rating,
  Button,
} from "@mui/material";

import * as AuthService from "../../../services/AuthService";
import * as MovieService from "../../../services/MovieService";
import { ReviewMovie } from "@/app/services/MovieService";
import { useAuth } from "@/app/hooks/useAuth";
import React, { useEffect, useState } from "react";
import EditReviews from "./EditReviews";
import Link from "next/link";

interface ReviewPageItemProps {
  review: ReviewMovie;
  movie: MovieService.Movie;
  setReviews: React.Dispatch<React.SetStateAction<ReviewMovie[]>>;
}

export default function ReviewPageItem({
  review,
  movie,
  setReviews,
}: ReviewPageItemProps) {
  const [displayUser, setDisplayUser] = useState<AuthService.UserTemp | null>(
    null
  );

  const { user } = useAuth();

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetched = async () => {
      const res = await AuthService.getUser(review.userId);
      res ? setDisplayUser(res) : setDisplayUser(null);
    };
    fetched();
  }, []);

  if (displayUser) {
    return (
      <Card key={review.userId} sx={{ mb: 2, position: "relative" }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex" }}>
            <Link href={`/profile/${review.userId}`}>
              <Avatar
                src={displayUser?.pfp}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
            </Link>
            <Box>
              <Typography variant="h6">{displayUser?.username}</Typography>
              <Rating value={review.rating} readOnly />
              {edit ? (
                <EditReviews
                  comment={review?.comment}
                  setEdit={setEdit}
                  movie={movie!}
                  setReviews={setReviews}
                  review={review}
                />
              ) : (
                <Typography variant="body2">{review?.comment}</Typography>
              )}
            </Box>
          </Box>

          {user?.id === displayUser?.id && (
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
}
