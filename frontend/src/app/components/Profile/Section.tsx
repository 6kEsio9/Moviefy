import { Box, Card, Grid, Typography } from "@mui/material";

import Link from "next/link";
import {
  MovieWatchList,
  UserProfile,
  WatchList,
} from "@/app/services/AuthService";
import Loading from "../Movies/Loading";
import SectionButtons from "./SectionButtons";
import React from "react";

interface SectionProps {
  title: string;
  movies: MovieWatchList[] | undefined;
  profileUser: UserProfile | undefined;
  setWatchList: React.Dispatch<React.SetStateAction<WatchList | undefined>>;
  watchStatus: string;
}

export default function Section({
  title,
  movies,
  profileUser,
  setWatchList,
  watchStatus,
}: SectionProps) {
  return (
    <Box mb={4}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      {movies ? (
        <Grid container spacing={2}>
          {movies.length > 0 ? (
            movies.map((movie) =>
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
                        src={movie.posterUrl ? movie.posterUrl : undefined}
                        alt={movie.title}
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                    <SectionButtons
                      watchStatus={watchStatus}
                      movie={movie}
                      profileUser={profileUser}
                      setWatchList={setWatchList}
                    />
                  </Card>
                </Grid>
              ) : null
            )
          ) : (
            <p>User doesn't have movies in this section.</p>
          )}
        </Grid>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
