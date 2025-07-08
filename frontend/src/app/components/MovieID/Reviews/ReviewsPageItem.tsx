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
import { Review } from "@/app/services/MovieService";
import { useAuth } from "@/app/hooks/useAuth";
import { useState } from "react";
import EditReviews from "./EditReviews";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ReviewPageItemProps {
  review: Review;
}

export default function ReviewPageItem({ review }: ReviewPageItemProps) {
  const { user, setUser } = useAuth();

  const [edit, setEdit] = useState(false);

  const movieId = useParams().id;
  const movie = MovieService.getMovie(+movieId!);

  return (
    <Card key={review.userId} sx={{ mb: 2, position: "relative" }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <Link href={`/profile/${review.userId}`}>
            <Avatar
              src={AuthService.getUser(review.userId)?.pfp}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
          </Link>
          <Box>
            <Typography variant="h6">
              {AuthService.getUser(review.userId)?.username}
            </Typography>
            <Rating value={review.rating} readOnly />
            {edit ? (
              <EditReviews
                comment={review?.comment}
                setEdit={setEdit}
                movie={movie!}
              />
            ) : (
              <Typography variant="body2">{review?.comment}</Typography>
            )}
          </Box>
        </Box>

        {user?.id === review.userId && (
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
