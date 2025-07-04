'use client'
import { Star } from "@mui/icons-material";
import { Box, Container, Divider, Grid, Stack, Typography } from "@mui/material";
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

const tr = {
  username: "isadksa",
  pfp: "https://a.ltrbxd.com/resized/avatar/upload/1/9/4/2/8/0/5/7/shard/avtr-0-144-0-144-crop.jpg?v=dad83a2711",
  rating: 3,
  review: "idk",
  likes: 1012
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

  const renderReviewStars = (n: number) => {
    const el = Array.from({ length: n });
    return(
      <div>
      {el.map(() => (
        <Star/>
      ))}
      </div>
    )
  }

  return(
    // <Container fixed>
      <Grid container sx={{marginTop: "15px", marginBottom: "15px"}}>
        <Grid size={3}>
          <img src={td.poster} style={{height:"400px", marginLeft: "20%"}}/>
        </Grid>
        <Grid size={9}>
          <Stack spacing={3} divider={<Divider orientation="horizontal"/>} sx={{marginLeft: "auto", marginRight: "auto"}}>
            <Box>
              <Typography
                variant="h2"
              >{td.title}</Typography>
              <Typography
                variant="h6"
                color="info"
              >{td.year}</Typography>
            </Box>
            <Box display="flex">
              <Typography
                sx={{fontSize: 18, overflow: "hidden"}}
              >{td.summary}</Typography>
            </Box>
            <Box>
              <Typography variant="h5" style={{marginBottom:"10px"}}>Cast</Typography>
              <Grid container spacing={1}>
                {renderCast()}
              </Grid>
            </Box>
          </Stack>
        </Grid>
        <Grid>
          <Typography variant="h4">Reviews</Typography>

          <Stack divider={<Divider orientation="horizontal"/>}>
            <Grid container>
              <img src={tr.pfp} style={{borderRadius: "100%", width: "50px"}}/>
              <Typography>{tr.username}</Typography>
              {renderReviewStars(tr.rating)}
            </Grid>
          </Stack>
        </Grid>
      </Grid> 
    // </Container>
  )
}
