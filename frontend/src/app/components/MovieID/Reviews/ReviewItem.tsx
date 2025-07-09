import Link from "next/link";
interface ReviewProps {
  review: ms.Review;
}
import { Grid, IconButton, Rating, Typography } from "@mui/material";
import * as ms from "@/app/services/MovieService";
import { getUser } from "@/app/services/AuthService";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useState } from "react";
import { useMovies } from "@/app/hooks/useMovies";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function ReviewItem({ review }: ReviewProps) {
  const user = getUser(review.userId);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes);
  const { movies, setMovies } = useMovies();

  const movieId = Number(useParams().id);

  const movie = movies.find((x) => x.id === movieId);

  const currentUser = useAuth();

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    const newLikeCount = likeCount + (newLiked ? 1 : -1);
    setLikeCount(newLikeCount);

    const updatedReviews = movie!.reviews.map((review) => {
      if (review.userId === user?.id) {
        return { ...review, likes: newLikeCount };
      }
      return review;
    });

    const updatedMovie = { ...movie!, reviews: updatedReviews };
    const updatedMovieList = movies.map((x) => {
      if (x.id === movie!.id) {
        return updatedMovie;
      }
      return x;
    });

    setMovies(updatedMovieList);
  };

  return (
    <Grid container columnGap={5} spacing={2} sx={{ margin: 2 }}>
      <Grid>
        <Link href={`/profile/${user?.id}`}>
          <img
            src={
              currentUser.user?.id === user?.id
                ? currentUser.user?.pfp
                : user?.pfp
            }
            style={{ borderRadius: "100%", width: "50px" }}
          />
        </Link>
      </Grid>
      <Grid container direction={"column"} spacing={3}>
        <Grid container direction={"row"} spacing={2}>
          <Typography>{user?.username}</Typography>
          <Rating value={review.rating} readOnly />
        </Grid>
        <Typography>{review.comment}</Typography>
        <Grid container direction={"row"}>
          <IconButton color="inherit" sx={{ padding: 0 }} onClick={handleLike}>
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <Typography>{likeCount}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
