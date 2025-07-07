import { Box, Card, Grid, Typography } from "@mui/material";

import { Movie } from "../../services/MovieService";
import Link from "next/link";
import CardButtons from "./SectionButtons";
import { User } from "@/app/services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";

interface SectionProps {
  title: string;
  movies: Movie[] | undefined;
  profileUser: User | undefined;
}

export default function Section({ title, movies, profileUser }: SectionProps) {
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
                <Card sx={{ height: "320px" }}>
                  <Link
                    href={`/movies/${movie.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      style={{ width: "100%", height: 200, objectFit: "cover" }}
                    />
                  </Link>
                  <CardButtons movie={movie} profileUser={profileUser} />
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
