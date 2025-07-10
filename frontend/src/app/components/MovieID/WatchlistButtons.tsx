"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { WatchList } from "@/app/services/AuthService";
import * as AuthService from "../../services/AuthService";
import { AccessTime, List, RemoveRedEyeRounded } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchlistButtons() {
  const { user } = useAuth();
  const movieId = +useParams().id!;

  const [watchStatus, setWatchStatus] = useState("none");
  const [watchList, setWatchList] = useState<WatchList>();

  useEffect(() => {
    const fetched = async () => {
      const res = await AuthService.getWatchList(user!.id);
      setWatchList(res);
    };
    fetched();
  }, [user]);

  useEffect(() => {
    if (watchList) {
      if (watchList.watched.includes(+movieId!)) setWatchStatus("watched");
      else if (watchList.isWatching.includes(+movieId!))
        setWatchStatus("watching");
      else if (watchList.willWatch.includes(+movieId!)) setWatchStatus("plan");
      else setWatchStatus("none");
    }
  }, []);

  const handleWatchlistChange = (state: string) => {
    // let updatedWatched = watchList?.watched;
    // let updatedPlan = watchList?.willWatch;
    // let updatedWatching = watchList?.isWatching;
    // switch (state) {
    //   case "watched": {
    //     if (watchStatus === "watched") {
    //       setWatchStatus("none");
    //       updatedWatched = updatedWatched!.filter((x) => x !== movieId);
    //     } else {
    //       setWatchStatus("watched");
    //       updatedWatched?.push(movieId);
    //       updatedWatching = updatedWatching?.filter((x) => x !== movieId);
    //       updatedPlan = updatedPlan?.filter((x) => x !== movieId);
    //     }
    //     break;
    //   }
    //   case "plan": {
    //     if (watchStatus === "plan") {
    //       setWatchStatus("none");
    //       updatedPlan = updatedPlan!.filter((x) => x !== movieId);
    //     } else {
    //       setWatchStatus("plan");
    //       updatedPlan?.push(movieId);
    //       updatedWatched = updatedWatched!.filter((x) => x !== movieId);
    //       updatedWatching = updatedWatching?.filter((x) => x !== movieId);
    //     }
    //     break;
    //   }
    //   case "watching": {
    //     if (watchStatus === "watching") {
    //       setWatchStatus("none");
    //       updatedWatching = updatedWatching!.filter((x) => x !== movieId);
    //     } else {
    //       setWatchStatus("watching");
    //       updatedWatching?.push(movieId);
    //       updatedWatched = updatedWatched!.filter((x) => x !== movieId);
    //       updatedPlan = updatedPlan!.filter((x) => x !== movieId);
    //     }
    //     break;
    //   }
    // }
    // const updatedWatchlist = {
    //   watched: updatedWatched!,
    //   isWatching: updatedWatching!,
    //   willWatch: updatedPlan!,
    // };
    // const updatedUser = { ...user, watchList: updatedWatchlist };
    // setUser(updatedUser as User);
  };

  return (
    <div style={{ position: "absolute", right: "20%" }}>
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
