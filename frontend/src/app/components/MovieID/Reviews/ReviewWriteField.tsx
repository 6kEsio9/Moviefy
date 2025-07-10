'use client'
import { useAuth } from "@/app/hooks/useAuth";
import { useMovies } from "@/app/hooks/useMovies";
import { Movie, Review } from "@/app/services/MovieService";
import { Box, Button, Container, Rating, TextField, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewWriteField(){
  const { user, setUser } = useAuth();
  const movieId = Number(useParams().id);
  const [shouldRender, setShouldRender] = useState(false)
  const [rating, setRating] = useState<number | null>(0)
  const { movies, setMovies } = useMovies();

  const handlePost = (formData: FormData) => {
    const reviewText = formData.get("reviewText")?.toString() || ""

    user!.reviews.push(Number(movieId));
    
    const newReview: Review = {
      userId: user!.id,
      rating: (rating) ? rating : 0,
      comment: reviewText,
      likes: []
    }
    const movie = movies.find((x) => x.id === movieId);

    const updatedReviews = movie!.reviews;
    updatedReviews.push(newReview)

    const updatedMovie = {...movie!, reviews: updatedReviews}
    const updatedMovieList: Movie[] = movies.map((x) => {
      if(x.id === movieId)return updatedMovie;
      return x;
    })

    setMovies(updatedMovieList);
    setShouldRender(false);
  }

  useEffect(() => {
    
    //fetch

    if(!user?.reviews.includes(+movieId!)){
      setShouldRender(true);
    }
  }, [])

  return(
    <Container>
      {shouldRender ?
      <Box>
        <Typography variant="h5" color="gray">{user === undefined ? "Sign in to write a review" : "Write a review"}</Typography>
        <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} disabled={user === undefined}/>
        <Box component="form" action={handlePost}>
          <TextField
            name="reviewText"  
            fullWidth
            multiline
            disabled={user === undefined}
            rows={5}/>
          <Button
            type="submit"
            variant="contained"
            disabled={user === undefined}
            sx={{mt: 2}}
            >Post
          </Button>
        </Box>
      </Box>
      
      : <></>}
    </Container>
  )
}