import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useAuth } from "@/app/hooks/useAuth";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "../../services/MovieService";

interface RatingLineProps {
  movie: Movie;
  movies: Movie[];
}

export default function RatingLine({ movie, movies }: RatingLineProps) {
  const [value, setValue] = React.useState<number | null>(0);

  const { user } = useAuth();
  const authToken = localStorage.getItem("user");

  React.useEffect(() => {
    const initialValue = movies
      .find((x) => x.id === movie.id)
      ?.reviews.find((x) => x.userId === user?.id);
    setValue(initialValue?.rating!);
  }, []);

  const onChangeHandler = (
    e: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => {
    if (!user) return;
    setValue(newValue);

    const fetched = async () => {
      await MovieService.rate(
        user.id,
        movie.id,
        newValue ? newValue : 0,
        authToken!
      );
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
