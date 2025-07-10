import Link from "next/link";
interface ReviewProps {
  movie: ms.Movie;
  review: ms.Review;
  setMovie: React.Dispatch<React.SetStateAction<ms.Movie | undefined>>;
}
import { Grid, IconButton, Rating, Typography } from "@mui/material";
import * as ms from "@/app/services/MovieService";
import { getUser, UserTemp } from "@/app/services/AuthService";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function ReviewItem({ review, movie, setMovie }: ReviewProps) {
  const [displayUser, setDisplayUser] = useState<UserTemp>();

  const [liked, setLiked] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetched = async () => {
      const resUser = await getUser(review.userId);
      setDisplayUser(resUser);
    };
    fetched();

    if (user) if (review.likes.includes(user.id)) setLiked(true);
  }, []);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    const updatedReview = review;
    newLiked
      ? updatedReview.likes.push(user!.id)
      : (updatedReview.likes = updatedReview.likes.filter(
          (x) => x !== user!.id
        ));

    const updatedReviews = movie!.reviews.map((review) => {
      if (review.userId === user?.id) {
        return updatedReview;
      }
      return review;
    });

    const updatedMovie = { ...movie!, reviews: updatedReviews };

    setMovie(updatedMovie);
  };

  return (
    <Grid container columnGap={5} spacing={2} sx={{ margin: 2 }}>
      <Grid>
        <Link href={`/profile/${user?.id}`}>
          <img
            src={displayUser?.pfp}
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
          <IconButton
            disabled={!user}
            color="inherit"
            sx={{ padding: 0 }}
            onClick={handleLike}
          >
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <Typography>{review.likes.length}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
