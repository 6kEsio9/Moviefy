import { Grid, Typography, Link } from "@mui/material"
import ScrollableImageList from "./ScrollableImageList"
import { Movie } from "@/app/services/MovieService";
import { useEffect, useState } from "react";

interface GenreSelectionProps{
  movies: Movie[];
  genre: string;
  textColor?: string;
  moreRedirect?: string
  dontFilter?: boolean
}

export default function GenreSelection({
  movies,
  genre,
  textColor = "GrayText",
  moreRedirect = '',
  dontFilter = false
}: GenreSelectionProps){

  const [moviesInGenre, setMoviesInGenre] = useState<Movie[]>([])

  useEffect(() => {
    if(!dontFilter){
      const tempMoviesArr:Movie[] = []
      movies.forEach((movie) => {
        if(movie.genre.normalize() === genre.normalize())tempMoviesArr.push(movie);
      })
      setMoviesInGenre(tempMoviesArr)
    }else setMoviesInGenre(movies)
  }, [movies])

  return(
    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
      <Typography variant="h5" sx={{color:textColor}}>{genre}</Typography>
      <Link href={moreRedirect !== '' ? moreRedirect : `movies?genre=${genre.toLowerCase()}`} underline="none">
        <Typography sx={{position: "relative", top: "7px"}}>{"MORE"}</Typography>
      </Link>
      <ScrollableImageList movies={moviesInGenre}/>
    </Grid>
  )
}