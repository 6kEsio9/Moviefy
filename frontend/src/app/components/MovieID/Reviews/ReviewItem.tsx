import Link from "next/link";
interface ReviewProps {
  review: ms.ReviewMovie;
}
import { Avatar, Grid, IconButton, Rating, Typography } from "@mui/material";
import * as ms from "@/app/services/MovieService";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function ReviewItem({ review }: ReviewProps) {

  const [liked, setLiked] = useState(review.isLiked);
  const [likeCount, setLikeCount] = useState(review.likeCount)

  const { user } = useAuth();
  const authToken = localStorage.getItem("user");

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1)
    // const updatedReview = review;
    // newLiked
    //   ? updatedReview.likes.push(user!.id)
    //   : (updatedReview.likes = updatedReview.likes.filter(
    //       (x) => x !== user!.id
    //     ));

    // const updatedReviews = movie!.reviews.map((review) => {
    //   if (review.userId === user?.id) {
    //     return updatedReview;
    //   }
    //   return review;
    // });

    // const updatedMovie = { ...movie!, reviews: updatedReviews };

    const fetched = async () => {
      await ms.like(String(review.id));
    };
    fetched();

    // setMovie(updatedMovie);
  };

  return (
    <Grid container columnGap={5} spacing={2} sx={{ margin: 2 }}>
      <Grid>
        <Link href={`/profile/${review.userId}`}>
          <Avatar
            src={review.pfpUrl}
            sx={{ width: 60, height: 60}}
          />
        </Link>
      </Grid>
      <Grid container direction={"column"} spacing={3}>
        <Grid container direction={"row"} spacing={2}>
          <Typography>{review.username}</Typography>
          <Rating value={review.rating} readOnly />
        </Grid>
        <Typography>{review.content}</Typography>
        <Grid container direction={"row"}>
          <IconButton
            disabled={!user}
            color="inherit"
            sx={{ padding: 0 }}
            onClick={handleLike}
          >
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <Typography>{likeCount}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
