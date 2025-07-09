"use client";

import { Box, Divider, Grid, Typography } from "@mui/material";
import { renderCastOrCrew } from "./RenderFunctions";
import { Movie } from "@/app/services/MovieService";
import { Star } from "@mui/icons-material";

interface MovieInfoProps {
  movie: Movie;
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <Grid container>
      <Grid size={3}>
        <img src={movie.imageUrl} style={{ height: "400px" }} />
      </Grid>
      <Grid size={6}>
        <Grid>
          <Grid container direction="row" alignItems="center" spacing={10}>
            <Box>
              <Typography variant="h2">{movie.title}</Typography>
              <Typography variant="h6" color="info">
                {movie.year}
              </Typography>
            </Box>
            <Typography>{`Directed by ${movie.director}`}</Typography>
          </Grid>

          <Divider orientation="horizontal" />

          <Box display="flex">
            <Typography sx={{ fontSize: 18, margin: 2 }}>
              {movie.summary}
            </Typography>
          </Box>

          <Divider orientation="horizontal" />

          <Grid container spacing={5}>
            <Grid size={6}>
              <Typography variant="h5" style={{ marginBottom: "10px" }}>
                Cast
              </Typography>
              {renderCastOrCrew(movie.cast)}
            </Grid>
            <Grid size={6}>
              <Typography variant="h5" style={{ marginBottom: "10px" }}>
                Crew
              </Typography>
              {renderCastOrCrew(movie.crew)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        size={3}
        justifyItems={"center"}
        sx={{ alignContent: "center", top: "20%", right: "20%" }}
      >
        <Typography variant="h3">Average Rating</Typography>
        <Typography variant="h3">
          {movie.avgRating}
          <Star />
        </Typography>
      </Grid>
    </Grid>
  );
}
