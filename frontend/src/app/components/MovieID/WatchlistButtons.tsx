"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { WatchList } from "@/app/services/AuthService";
import * as AuthService from "../../services/AuthService";
import { AccessTime, List, RemoveRedEyeRounded } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface WatchListButtonsProps {
  movie: AuthService.MovieWatchList;
}

export default function WatchlistButtons({ movie }: WatchListButtonsProps) {
  const { user } = useAuth();

  const [watchStatus, setWatchStatus] = useState("none");
  const [watchList, setWatchList] = useState<WatchList>();

  useEffect(() => {
    const fetched = async () => {
      const res = await AuthService.getWatchList(user?.id!);
      console.log(res);
      setWatchList(res.data);
    };
    fetched();
  }, [user]);

  useEffect(() => {
    if (!watchList || !movie) return;

    if (watchList.watched.some((x) => x.id === movie.id)) {
      setWatchStatus("watched");
    } else if (watchList.isWatching.some((x) => x.id === movie.id))
      setWatchStatus("watching");
    else if (watchList.willWatch.some((x) => x.id === movie.id))
      setWatchStatus("plan");
    else setWatchStatus("none");
  }, [watchList, movie]);

  const handleWatchlistChange = (state: string) => {
    let updatedWatched = [...(watchList?.watched || [])];
    let updatedPlan = [...(watchList?.willWatch || [])];
    let updatedWatching = [...(watchList?.isWatching || [])];

    switch (state) {
      case "watched": {
        if (watchStatus === "watched") {
          setWatchStatus("none");
          updatedWatched = updatedWatched!.filter((x) => x.id !== movie.id);
        } else {
          setWatchStatus("watched");
          updatedWatched?.push(movie);
          updatedWatching = updatedWatching?.filter((x) => x.id !== movie.id);
          updatedPlan = updatedPlan?.filter((x) => x.id !== movie.id);
        }
        break;
      }

      case "plan": {
        if (watchStatus === "plan") {
          setWatchStatus("none");
          updatedPlan = updatedPlan!.filter((x) => x.id !== movie.id);
        } else {
          setWatchStatus("plan");
          updatedPlan?.push(movie);
          updatedWatched = updatedWatched?.filter((x) => x.id !== movie.id);
          updatedWatching = updatedWatching?.filter((x) => x.id !== movie.id);
        }
        break;
      }

      case "watching": {
        if (watchStatus === "watching") {
          setWatchStatus("none");
          updatedWatching = updatedWatching!.filter((x) => x.id !== movie.id);
        } else {
          setWatchStatus("watching");
          updatedWatching?.push(movie);
          updatedWatched = updatedWatched!.filter((x) => x.id !== movie.id);
          updatedPlan = updatedPlan!.filter((x) => x.id !== movie.id);
        }
        break;
      }
    }

    setWatchList({
      watched: updatedWatched,
      willWatch: updatedPlan,
      isWatching: updatedWatching,
    });

    const index = AuthService.statusToNum(
      state === watchStatus ? "none" : state
    );

    const fetched = async () => {
      const req = await AuthService.changeMovieStatus(movie.id, index!);
      console.log(req);
    };
    fetched();
  };

  return (
    <div>
      <IconButton
        onClick={() => handleWatchlistChange("watched")}
        color={watchStatus === "watched" ? "success" : "default"}
      >
        <RemoveRedEyeRounded />
        <Typography>
          {watchStatus === "watched" ? "Watched" : "Watch"}
        </Typography>
      </IconButton>
      <IconButton
        onClick={() => handleWatchlistChange("watching")}
        color={watchStatus === "watching" ? "info" : "default"}
      >
        <List />
        <Typography>
          {watchStatus === "watching" ? "Currently watching" : "Watching"}
        </Typography>
      </IconButton>
      <IconButton
        onClick={() => handleWatchlistChange("plan")}
        color={watchStatus === "plan" ? "secondary" : "default"}
      >
        <AccessTime />
        <Typography>
          {watchStatus === "plan" ? "Planned to watch" : "Plan to watch"}
        </Typography>
      </IconButton>
    </div>
  );
}
