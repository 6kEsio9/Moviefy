import { Grid, IconButton, Rating, Typography } from "@mui/material";
import * as ms from "@/app/services/MovieService";
import { getUser } from "@/app/services/AuthService";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useState } from "react";

interface ReviewProps {
  review: ms.Rating;
}

export default function Review({ review }: ReviewProps) {
  const user = getUser(review.userId);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked)
    
    // change amount of likes
  }

  return (
    <Grid container columnGap={5} spacing={2} sx={{ margin: 2 }}>
      <Grid>
        <img src={user?.pfp} style={{ borderRadius: "100%", width: "50px" }} />
      </Grid>
      <Grid container direction={"column"} spacing={3}>
        <Grid container direction={"row"} spacing={2}>
          <Typography>{user?.username}</Typography>
          <Rating value={review.rating} readOnly/>
        </Grid>
        <Typography>{review.comment}</Typography>
        <Grid container direction={"row"}>
          <IconButton color="inherit" sx={{padding: 0}} onClick={handleLike}>
            {liked ? <Favorite color="error"/> : <FavoriteBorder/>}
          </IconButton>
          <Typography>{review.likes}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
