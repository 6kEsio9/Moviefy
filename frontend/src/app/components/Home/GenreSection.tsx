import { Grid, Typography, Link } from "@mui/material";
import ScrollableImageList from "./ScrollableImageList";
import { Movie } from "@/app/services/MovieService";
import { useEffect, useState } from "react";
import * as MovieService from "@/app/services/MovieService"

interface GenreSelectionProps {
  movies?: Movie[];
  genre: string;
  textColor?: string;
  moreRedirect?: string;
}

export default function GenreSelection({  
  movies,
  genre,
  textColor = "GrayText",
  moreRedirect = "",
}: GenreSelectionProps) {
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetched = async () => {
      const res = await MovieService.getAll(10, 0);
      setDisplayMovies(res.data);
    };
    if(!movies)fetched();
  })

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="h5" sx={{ color: textColor }}>
        {genre}
      </Typography>
      <Link
        href={
          moreRedirect !== ""
            ? moreRedirect
            : `movies?genre=${genre.toLowerCase()}`
        }
        underline="none"
      >
        <Typography sx={{ position: "relative", top: "7px" }}>
          {"MORE"}
        </Typography>
      </Link>
      <ScrollableImageList movies={movies ? movies : displayMovies} />
    </Grid>
  );
}
