import { CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import { Movie } from "@/app/services/MovieService";
import { useState } from "react";
import { UserProfile, WatchList } from "@/app/services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";

interface SectionButtonsProps {
  watchStatus: string;
  movie: Movie;
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
    if (watchStatus === state) return;
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
