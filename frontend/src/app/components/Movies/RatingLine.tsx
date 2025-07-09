import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useMovies } from "@/app/hooks/useMovies";
import { useAuth } from "@/app/hooks/useAuth";

interface RatingLineProps {
  movieId: number;
}

export default function RatingLine({ movieId }: RatingLineProps) {
  const [value, setValue] = React.useState<number | null>(0);
  const { movies, setMovies } = useMovies();

  const { user, setUser } = useAuth();

  const onChangeHandler = (
    e: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => {
    setValue(newValue);
    const movieIndex = movies.findIndex((x) => x.id === movieId);
    const movie = movies[movieIndex];

    const updatedReviews = [...movie.reviews];

    const userIndex = updatedReviews.findIndex((x) => x.userId === user!.id);

    if (userIndex === -1) {
      updatedReviews.push({
        userId: user!.id,
        rating: newValue!,
        comment: "",
        likes: 0,
      });
    } else {
      updatedReviews[userIndex] = {
        ...updatedReviews[userIndex],
        rating: newValue!,
      };
    }

    const ratedMovie = {
      ...movie,
      reviews: updatedReviews,
      avgRating:
        updatedReviews.reduce((acc, r) => acc + r.rating, 0) /
        updatedReviews.length,
    };

    const updatedMovies = [...movies];
    updatedMovies[movieIndex] = ratedMovie;

    if (!user?.reviews.includes(movieId)) {
      const updatedReviewsUser = [...user?.reviews!];
      updatedReviewsUser.push(movieId);

      const updatedUser = {
        ...user!,
        reviews: updatedReviewsUser,
      };

      setUser(updatedUser);
    }

    setMovies(updatedMovies);

    //movieservice.rate(userid, movieid, rating, comment);
  };

  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={onChangeHandler}
      />
    </Box>
  );
}
