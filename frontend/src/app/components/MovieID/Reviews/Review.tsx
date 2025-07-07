import { Grid, Typography } from "@mui/material";
import { renderReviewStars } from "../RenderFunctions";
import { Rating } from "@/app/services/MovieService";
import { getUser } from "@/app/services/AuthService";

interface ReviewProps {
  review: Rating;
}

export default function Review({ review }: ReviewProps) {
  const user = getUser(review.userId);

  return (
    <Grid container direction={"row"} spacing={2} sx={{ margin: 2 }}>
      <Grid>
        <img src={user?.pfp} style={{ borderRadius: "100%", width: "50px" }} />
        <Typography sx={{ position: "relative", left: "20px", top: "20px" }}>
          {review.comment}
        </Typography>
      </Grid>
      <Typography>{user?.username}</Typography>
      {renderReviewStars(review.rating)}
    </Grid>
  );
}
