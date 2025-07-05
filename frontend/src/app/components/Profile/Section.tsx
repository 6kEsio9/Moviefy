import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { Movie } from "../../services/MovieService";
import * as MovieService from "../../services/MovieService";

export default function Section({
  title,
  movies,
}: {
  title: string;
  movies: Movie[] | undefined;
}) {
  return (
    <Box mb={4}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {movies!.length > 0 ? (
          movies!.map((movie) =>
            movie ? (
              <Grid
                item
                key={movie.id}
                xs={6}
                sm={4}
                md={3}
                sx={{ width: "150px" }}
                {...({} as any)}
              >
                <Card sx={{ height: "300px" }}>
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1">{movie.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {movie.year}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          )
        ) : (
          <p>User doesn't have movies in this section.</p>
        )}
      </Grid>
    </Box>
  );
}
