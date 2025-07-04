import { List, RemoveRedEyeRounded } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useState } from "react";

export default function WatchlistButtons(){
  const [watchStatus, setWatchStatus] = useState('notwatched');

  const addToWatched = () => {
    if(watchStatus === "watched"){
      setWatchStatus("notwatched");
    } else {
      setWatchStatus("watched")
    }
  }

  const addToPlanToWatch = () => {
    if(watchStatus === "plan"){
      setWatchStatus("notwatched");
    } else {
      setWatchStatus("plan")
    }
  }

  return(
  <div style={{position: "absolute", right: "20%"}}>
    <IconButton onClick={addToWatched} color={watchStatus === "watched" ? "success" : "default"}>
      <RemoveRedEyeRounded/>
      <Typography>{watchStatus === "watched" ? "Watched" : "Watch"}</Typography>
    </IconButton>
    <IconButton onClick={addToPlanToWatch} color={watchStatus === "plan" ? "secondary" : "default"}>
      <List/>
      <Typography>{watchStatus === "plan" ? "Planned to watch" : "Plan to watch"}</Typography>
    </IconButton>
  </div>
  )
}