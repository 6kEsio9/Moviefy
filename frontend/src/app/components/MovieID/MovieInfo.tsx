import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { renderCastOrCrew } from "./RenderFunctions";

interface MovieInfoProps{
  movie: {
    title: string;
    year: number;
    director: string;
    cast: string[];
    crew: string[]
    poster: string;
    summary: string;
  }
}

export default function MovieInfo({movie}: MovieInfoProps){
  return(
    <Grid container sx={{marginRight: "15%", marginLeft: "15%"}}>
      <Grid size={3}>
        <img src={movie.poster} style={{height:"400px"}}/>
      </Grid>
      <Grid size={9}>
        <Grid>
          <Grid container direction="row" alignItems="center" spacing={10}>
            <Box>
              <Typography variant="h2">{movie.title}</Typography>
              <Typography variant="h6" color="info">{movie.year}</Typography>
            </Box>
            <Typography>{`Directed by ${movie.director}`}</Typography>
          </Grid>

          <Divider orientation="horizontal"/>
          
          <Box display="flex">
            <Typography
              sx={{fontSize: 18, margin: 2}}
            >{movie.summary}</Typography>
          </Box>

          <Divider orientation="horizontal"/>
          
          <Grid container spacing={5}>
            <Grid size={6} >
              <Typography variant="h5" style={{marginBottom:"10px"}}>Cast</Typography>
                {renderCastOrCrew(movie.cast)}
            </Grid>
            <Grid size={6}>
              <Typography variant="h5" style={{marginBottom:"10px"}}>Crew</Typography>
                {renderCastOrCrew(movie.crew)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}