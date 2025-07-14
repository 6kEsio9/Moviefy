import { CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import { UserProfile, WatchList } from "@/app/services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";
import * as AuthService from "../../services/AuthService";

interface SectionButtonsProps {
  watchStatus: string;
  movie: AuthService.MovieWatchList;
  profileUser: UserProfile | undefined;
  setWatchList: React.Dispatch<React.SetStateAction<WatchList | undefined>>;
}

export default function SectionButtons({
  watchStatus,
  profileUser,
  movie,
  setWatchList,
}: SectionButtonsProps) {
  const [hover, setHover] = useState(false);

  const { user } = useAuth();

  const [status, setStatus] = useState(false);

  const handleWatchlistChange = (state: string) => {
    setHover(false);
    setStatus(false);
    if (watchStatus === state) return;

    switch (state) {
      case "watched": {
        setWatchList((prevWatchlist) => {
          return {
            watched: [...prevWatchlist!.watched, movie],
            isWatching: prevWatchlist!.isWatching.filter(
              (x) => x.id !== movie.id
            ),
            willWatch: prevWatchlist!.willWatch.filter(
              (x) => x.id !== movie.id
            ),
          };
        });
        break;
      }
      case "watching": {
        setWatchList((prevWatchlist) => {
          return {
            watched: prevWatchlist!.watched.filter((x) => x.id !== movie.id),
            isWatching: [...prevWatchlist!.isWatching, movie],
            willWatch: prevWatchlist!.willWatch.filter(
              (x) => x.id !== movie.id
            ),
          };
        });
        break;
      }
      case "plan": {
        setWatchList((prevWatchlist) => {
          return {
            watched: prevWatchlist!.watched.filter((x) => x.id !== movie.id),
            isWatching: prevWatchlist!.isWatching.filter(
              (x) => x.id !== movie.id
            ),
            willWatch: [...prevWatchlist!.willWatch, movie],
          };
        });
        break;
      }
      case "remove": {
        setWatchList((prevWatchlist) => {
          return {
            watched: prevWatchlist!.watched.filter((x) => x.id !== movie.id),
            isWatching: prevWatchlist!.isWatching.filter(
              (x) => x.id !== movie.id
            ),
            willWatch: prevWatchlist!.willWatch.filter(
              (x) => x.id !== movie.id
            ),
          };
        });
        break;
      }
    }

    const index = AuthService.statusToNum(
      state === watchStatus ? "none" : state
    );

    const fetched = async () => {
      const req = await AuthService.changeMovieStatus(movie.id!, index);
      console.log(req);
    };
    fetched();
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
            {movie.startYear}
          </Typography>
        </div>
      )}
    </CardContent>
  );
}
