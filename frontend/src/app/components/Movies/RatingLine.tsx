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

  React.useEffect(() => {
    const movieIndex = movies.findIndex((x) => x.id === movieId);
    const movie = movies[movieIndex];

    const updatedRatings = [...movie.ratings];

    const userIndex = updatedRatings.findIndex((x) => x.userId === user!.id);

    if (userIndex === -1) {
      updatedRatings.push({ userId: user!.id, rating: value!, comment: "" });
    } else {
      updatedRatings[userIndex] = {
        ...updatedRatings[userIndex],
        rating: value!,
      };
    }

    const ratedMovie = {
      ...movie,
      ratings: updatedRatings,
      avgRating:
        updatedRatings.reduce((acc, r) => acc + r.rating, 0) /
        updatedRatings.length,
    };

    const updatedMovies = [...movies];
    updatedMovies[movieIndex] = ratedMovie;

    user?.reviews.includes(movie.id) ? "" : user?.reviews.push(movie.id);
    setMovies(updatedMovies);

    //movieservice.rate(userid, movieid, rating, comment);
  }, [value]);

  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          console.log(user);
          console.log(movies);
        }}
      />
    </Box>
  );
}
