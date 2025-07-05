import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Section from "./Section";
import { User } from "@/app/services/AuthService";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "@/app/services/MovieService";

interface TabsButtonsProps {
  profileUser: User | undefined;
}

export default function TabsButtons({ profileUser }: TabsButtonsProps) {
  const [tab, setTab] = useState(0);

  const [watched, setWatched] = useState<Movie[]>([]);
  const [isWatching, setIsWatching] = useState<Movie[]>([]);
  const [willWatch, setWillWatch] = useState<Movie[]>([]);

  useEffect(() => {
    let watchedResult: Movie[] = [];
    profileUser?.watchList.watched.map((x) => {
      watchedResult.push(MovieService.getMovie(x)!);
    });
    setWatched(watchedResult);

    let isWatchingResult: Movie[] = [];
    profileUser?.watchList.isWatching.map((x) => {
      isWatchingResult.push(MovieService.getMovie(x)!);
    });
    setIsWatching(isWatchingResult);

    let willWatchResult: Movie[] = [];
    profileUser?.watchList.willWatch.map((x) => {
      willWatchResult.push(MovieService.getMovie(x)!);
    });
    setWillWatch(willWatchResult);
  }, []);

  return (
    <>
      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} centered>
        <Tab label="Watchlist" />
        <Tab label="Reviews" />
      </Tabs>

      <Box mt={4}>
        {tab === 0 && (
          <Box>
            <Section title="🎬 Watched" movies={watched} />
            <Section title="⏳ Is Watching" movies={isWatching} />
            <Section title="📌 Will Watch" movies={willWatch} />
          </Box>
        )}

        {tab === 1 && (
          <Box>
            {/* {user.reviews.map((r, i) => {
                  const movie = getMovieById(r.movieId);
                  if (!movie) return null;
                  return (
                    <Card key={i} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{movie.title}</Typography>
                        <Rating value={r.rating} readOnly />
                        <Typography variant="body2">{r.comment}</Typography>
                      </CardContent>
                    </Card>
                  );
                })} */}
          </Box>
        )}
      </Box>
    </>
  );
}
