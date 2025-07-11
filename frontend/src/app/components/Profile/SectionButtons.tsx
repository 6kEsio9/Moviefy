import { CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import { Movie } from "@/app/services/MovieService";
import { useState } from "react";
import { UserProfile } from "@/app/services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";

interface CardButtonsProps {
  movie: Movie;
  profileUser: UserProfile | undefined;
}

export default function SectionButtons({
  profileUser,
  movie,
}: CardButtonsProps) {
  const [hover, setHover] = useState(false);

  const { user } = useAuth();

  const [status, setStatus] = useState(false);

  const handleWatchlistChange = (state: string) => {
    let updatedWatched = user!.watchList.watched;
    let updatedPlan = user!.watchList.willWatch;
    let updatedWatching = user!.watchList.isWatching;

    switch (state) {
      case "watched": {
        updatedWatched!.push(movie.id);
        updatedWatching = updatedWatching!.filter((x) => x !== movie.id);
        updatedPlan = updatedPlan!.filter((x) => x !== movie.id);
        break;
      }

      case "watching": {
        updatedWatched = updatedWatched!.filter((x) => x !== movie.id);
        updatedWatching!.push(movie.id);
        updatedPlan = updatedPlan!.filter((x) => x !== movie.id);
        break;
      }

      case "plan": {
        updatedWatched = updatedWatched!.filter((x) => x !== movie.id);
        updatedWatching = updatedWatching!.filter((x) => x !== movie.id);
        updatedPlan!.push(movie.id);
        break;
      }

      case "remove": {
        updatedWatched = updatedWatched!.filter((x) => x !== movie.id);
        updatedWatching = updatedWatching!.filter((x) => x !== movie.id);
        updatedPlan = updatedPlan.filter((x) => x !== movie.id);
        break;
      }
    }

    const updatedWatchlist = {
      watched: updatedWatched!,
      isWatching: updatedWatching!,
      willWatch: updatedPlan!,
    };
    const updatedUser = { ...user, watchList: updatedWatchlist };
    setUser(updatedUser as User);

  };


  return (
    <CardContent
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setStatus(false);
      }}
    >
      {user?.id === profileUser?.id && hover ? (
        status ? (
          <div>
            <Button
              onClick={() => handleWatchlistChange("watched")}
              variant="contained"
              sx={{ fontSize: "10px", width: "120px" }}
            >
              Watched
            </Button>
            <Button
              onClick={() => handleWatchlistChange("watching")}
              variant="contained"
              sx={{ fontSize: "10px", width: "120px" }}
            >
              Is Watching
            </Button>
            <Button
              onClick={() => handleWatchlistChange("plan")}
              variant="contained"
              sx={{ fontSize: "10px", width: "120px" }}
            >
              Will Watch
            </Button>
          </div>
        ) : (
          <div>
            <Button
              variant="contained"
              sx={{ fontSize: "10px", width: "120px", mt: "15px" }}
              onClick={() => setStatus(true)}
            >
              Edit status
            </Button>
            <Button
              variant="outlined"
              sx={{ fontSize: "10px", width: "120px" }}
              onClick={() => handleWatchlistChange("remove")}
            >
              Remove
            </Button>
          </div>
        )
      ) : (
        <div>
          <Typography variant="subtitle1">{movie.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.year}
          </Typography>
        </div>
      )}
    </CardContent>
  );
}
