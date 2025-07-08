import { Grid, Typography } from "@mui/material"

export function renderCastOrCrew(cast: string[]) {
  return  <Grid container spacing={1}>
    {cast.map((castMember, index) => {
      return <Typography
        key={index}
        sx = {{background: "gray", borderRadius: "3px", display: "inline-block", padding: 1, color: "white"}}
      >{castMember}</Typography>
    })}
  </Grid>
}