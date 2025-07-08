import { Review } from "@/app/services/MovieService";
import { Container, Divider, Grid, Typography } from "@mui/material";
import ReviewItem from "./ReviewItem";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <Grid>
      <Container>
        <Typography variant="h4" marginBottom={3}>
          Reviews
        </Typography>

        <Grid container direction={"column"} spacing={3}>
          {reviews.map((review) => {
            return (
              <div key={review.userId}>
                <Divider orientation="horizontal"/>
                <ReviewItem review={review}/>
              </div>
            );
          })}
        </Grid>
      </Container>
    </Grid>
  );
}
