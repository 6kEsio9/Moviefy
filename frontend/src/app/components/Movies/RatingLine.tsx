import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useAuth } from "@/app/hooks/useAuth";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "../../services/MovieService";
import { ReviewUser } from "@/app/services/AuthService";

interface RatingLineProps {
  movie: Movie;
  userReviews: ReviewUser[];
}

export default function RatingLine({ movie, userReviews }: RatingLineProps) {
  const [value, setValue] = React.useState<number | null>(0);

  const { user } = useAuth();

  React.useEffect(() => {
    const initialValue = userReviews.find((x) => x.movieId === movie.id);
    setValue(initialValue?.rating!);
  }, []);

  const onChangeHandler = (
    e: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => {
    if (!user) return;
    setValue(newValue);

    const fetched = async () => {
      const res = await MovieService.rate(movie.id, newValue ? newValue : 0);
      console.log(res);
    };
    fetched();
  };

  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={onChangeHandler}
        disabled={!user}
      />
    </Box>
  );
}
