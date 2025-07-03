'use client'
import { Box, Container, Grid, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

//testing data
const td = { 
  title: "F1",
  year: 2025,
  cast: ["Brad Pitt", "Damson Idris"],
  poster: 'https://a.ltrbxd.com/resized/film-poster/8/1/7/9/7/7/817977-f1-the-movie-0-1000-0-1500-crop.jpg?v=f5ae2b99b9',
  summary: "Racing legend Sonny Hayes is coaxed out of retirement to lead a struggling Formula 1 team—and mentor a young hotshot driver—while chasing one more chance at glory."
}


export default function MovieDetails() {
  const pn = usePathname()
  const id = pn.substring(pn.lastIndexOf('/') + 1);
  useEffect(() => {
    console.log(id);
  })

  const renderCast = () => {
  return td.cast.map((castMember) => {
    return <Typography
      sx = {{background: "gray", borderRadius: "3px", display: "inline-block", padding: 1, color: "white"}}
    >{castMember}</Typography>
  })
}

  return(
    <Container>
      <Typography
        variant="h2"
      >{td.title}</Typography>
      <Typography>{td.year}</Typography>
      <Typography>{td.summary}</Typography>
      <Grid container spacing={1}>
        {renderCast()}
      </Grid>
    </Container>
  )
}
