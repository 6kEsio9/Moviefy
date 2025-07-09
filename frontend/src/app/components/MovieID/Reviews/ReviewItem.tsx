import Link from "next/link";
interface ReviewProps {
  review: ms.Review;
}
import { Grid, IconButton, Rating, Typography } from "@mui/material";
import * as ms from "@/app/services/MovieService";
import { getUser } from "@/app/services/AuthService";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useMovies } from "@/app/hooks/useMovies";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function ReviewItem({ review }: ReviewProps) {
  const user = getUser(review.userId);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(review.likes);
  const { movies, setMovies } = useMovies();

  const movieId = Number(useParams().id);

  const movie = movies.find((x) => x.id === movieId);

  const currentUser = useAuth();

  useEffect(() => {
    if(review.likes.includes(currentUser.user!.id))setLiked(true)
  }, [])

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    const updatedReview = review;
    newLiked ? updatedReview.likes.push(currentUser.user!.id) : updatedReview.likes = updatedReview.likes.filter((x) => x !== currentUser.user!.id)

    const updatedReviews = movie!.reviews.map((review) => {
      if (review.userId === user?.id) {
        return updatedReview;
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

    setMovies(updatedMovieList as ms.Movie[]);
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
          <Typography>{review.likes.length}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
