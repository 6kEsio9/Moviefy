import { Movie } from "@/app/services/MovieService";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography,
  Rating,
} from "@mui/material";

export default function Section({
  title,
  movies,
}: {
  title: string;
  movies: (Movie | undefined)[];
}) {
  return (
    <Box mb={4}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {movies.map((movie) =>
          movie ? (
            <Grid item key={movie.id} xs={6} sm={4} md={3} {...({} as any)}>
              <Card>
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
        )}
      </Grid>
    </Box>
  );
}
