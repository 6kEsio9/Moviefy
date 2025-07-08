import { Grid, Typography } from "@mui/material";
import { renderReviewStars } from "../RenderFunctions";
import { Review } from "@/app/services/MovieService";
import { getUser } from "@/app/services/AuthService";
import Link from "next/link";

interface ReviewProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewProps) {
  const user = getUser(review.userId);

  return (
    <Grid container direction={"row"} spacing={2} sx={{ margin: 2 }}>
      <Grid>
        <Link href={`/profile/${user?.id}`}>
          <img
            src={user?.pfp}
            style={{ borderRadius: "100%", width: "50px" }}
          />
        </Link>
        <Typography sx={{ position: "relative", left: "20px", top: "20px" }}>
          {review.comment}
        </Typography>
      </Grid>
      <Typography>{user?.username}</Typography>
      {renderReviewStars(review.rating)}
    </Grid>
  );
}
