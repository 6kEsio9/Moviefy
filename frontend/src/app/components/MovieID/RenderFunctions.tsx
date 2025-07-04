import { Star } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material"

export function renderCastOrCrew(cast: string[]) {
  return  <Grid container spacing={1}>
    {cast.map((castMember) => {
      return <Typography
        sx = {{background: "gray", borderRadius: "3px", display: "inline-block", padding: 1, color: "white"}}
      >{castMember}</Typography>
    })}
  </Grid>
}

export function renderReviewStars(n: number) {
  const el = Array.from({ length: n });
  return(
    <div>
    {el.map(() => (
      <Star/>
    ))}
    </div>
  )
}