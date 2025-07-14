"use client";

import {
  Box,
  Divider,
  Grid,
  Typography,
  Stack,
  useTheme
} from "@mui/material";
import { renderCastOrCrew } from "./RenderFunctions";
import { Movie } from "@/app/services/MovieService";
import { Star } from "@mui/icons-material";
import WatchlistButtons from "./WatchlistButtons";

interface MovieInfoProps {
  movie: Movie;
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  const theme = useTheme();

  return (
    <Grid container spacing={4} padding={4}>
      <Grid size={{xs: 12, md: 4, lg: 3}}>
        <Box
          component="img"
          src={movie.posterUrl}
          alt={movie.title}
          sx={{
            height: { xs: 400, md: 500 },
            objectFit: "cover",
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
      </Grid>

      <Grid size={{xs: 12, md: 8, lg: 6}}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h3">{movie.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {movie.year}
            </Typography>
          </Box>

          <WatchlistButtons movie={movie} />

          <Divider />

          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {movie.summary}
          </Typography>

          <Divider />

          <Grid container spacing={4}>
            <Grid size={12}>
              <Typography variant="h5" gutterBottom>
                Cast
              </Typography>
              {renderCastOrCrew(movie.cast)}
            </Grid>
          </Grid>
        </Stack>
      </Grid>

      <Grid size={{xs: 12, lg: 3}}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems={{ xs: "flex-start", lg: "center" }}
          justifyContent="center"
          height="100%"
          textAlign={{ xs: "left", lg: "center" }}
          sx={{
            backgroundColor: theme.palette.grey[100],
            borderRadius: 2,
            padding: 3,
            boxShadow: 1,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Average Rating
          </Typography>
          <Typography variant="h3" color="primary">
            {movie.avgRating} <Star fontSize="inherit" />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
