import * as React from "react";
import { Movie } from "@/app/services/MovieService";
import { Container, Divider, Grid, Typography } from "@mui/material";
import ReviewItem from "./ReviewItem";

interface ReviewListProps {
  movie: Movie;
}

export default function ReviewList({ movie }: ReviewListProps) {
  return (
    <Grid>
      <Container>
        <Typography variant="h4" marginBottom={3}>
          Reviews
        </Typography>

        <Grid container direction={"column"} spacing={3}>
          {movie.reviews
            .sort((a, b) => b.likes.length - a.likes.length)
            .map((review) => {
              return (
                <div key={review.userId}>
                  <Divider orientation="horizontal" />
                  <ReviewItem
                    review={review}
                    movie={movie}
                  />
                </div>
              );
            })}
        </Grid>
      </Container>
    </Grid>
  );
}
