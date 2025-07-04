import { Box, Grid, Typography } from "@mui/material";
import { renderReviewStars } from "./RenderFunctions";

interface ReviewProps {
  review: {pfp: string, username: string, rating: number, review: string};
}

export default function Review({review}: ReviewProps){
  return(
    <Grid container direction={"row"} spacing={2} sx={{margin: 2}}>
      <Grid>
        <img src={review.pfp} style={{borderRadius: "100%", width: "50px"}}/>
        <Typography sx={{position: "relative", left:"20px", top: "20px"}}>{review.review}</Typography>  
      </Grid>
      <Typography>{review.username}</Typography>
      {renderReviewStars(review.rating)}
    </Grid>
  )
}