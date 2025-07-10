import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Section from "./Section";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "@/app/services/MovieService";
import Reviews from "./Reviews/ReviewsTab";
import { useParams } from "next/navigation";

import * as AuthService from "../../services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";

export default function TabsButtons() {
  const [tab, setTab] = useState(0);

  const { user, setUser } = useAuth();

  const userId = Number(useParams().id);
  const profileUser = userId === user?.id ? user : AuthService.getUser(userId!);

  const [watched, setWatched] = useState<Movie[]>([]);
  const [isWatching, setIsWatching] = useState<Movie[]>([]);
  const [willWatch, setWillWatch] = useState<Movie[]>([]);

  useEffect(() => {
    const watchedResult: Movie[] = [];
    profileUser?.watchList.watched.map((x) => {
      watchedResult.push(MovieService.getMovie(x)!);
    });
    setWatched(watchedResult);

    const isWatchingResult: Movie[] = [];
    profileUser?.watchList.isWatching.map((x) => {
      isWatchingResult.push(MovieService.getMovie(x)!);
    });
    setIsWatching(isWatchingResult);

    const willWatchResult: Movie[] = [];
    profileUser?.watchList.willWatch.map((x) => {
      willWatchResult.push(MovieService.getMovie(x)!);
    });
    setWillWatch(willWatchResult);
  }, [user?.watchList.watched, user?.watchList.isWatching, user?.watchList.willWatch]);

  return (
    <>
      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} centered>
        <Tab label="Watchlist" />
        <Tab label="Reviews" />
      </Tabs>

      <Box mt={4}>
        {tab === 0 && (
          <Box>
            <Section
              title="🎬 Watched"
              movies={watched}
              profileUser={profileUser?.id === user?.id ? user : profileUser}
            />
            <Section
              title="⏳ Is Watching"
              movies={isWatching}
              profileUser={profileUser?.id === user?.id ? user : profileUser}
            />
            <Section
              title="📌 Will Watch"
              movies={willWatch}
              profileUser={profileUser?.id === user?.id ? user : profileUser}
            />
          </Box>
        )}

        {tab === 1 && (
          <Reviews
            profileUser={profileUser?.id === user?.id ? user : profileUser}
          />
        )}
      </Box>
    </>
  );
}
