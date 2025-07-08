import { Rating } from "@/app/services/MovieService";
import { Container, Divider, Grid, Typography } from "@mui/material";
import Review from "./Review";

interface ReviewListProps {
  ratings: Rating[];
}

export default function ReviewList({ ratings }: ReviewListProps) {
  return (
    <Grid>
      <Container>
        <Typography variant="h4" marginBottom={3}>
          Reviews
        </Typography>

        <Grid container direction={"column"} spacing={3}>
          {ratings.map((review, index) => {
            return (
              <div key={index}>
                <Divider orientation="horizontal" />
                <Review review={review} />
              </div>
            );
          })}
        </Grid>
      </Container>
    </Grid>
  );
}
