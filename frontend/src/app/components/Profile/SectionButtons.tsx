import { CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import { Movie } from "@/app/services/MovieService";
import { useState } from "react";
import { User } from "@/app/services/AuthService";
import { useAuth } from "@/app/hooks/useAuth";

interface CardButtonsProps {
  movie: Movie;
  profileUser: User | undefined;
}

export default function SectionButtons({
  profileUser,
  movie,
}: CardButtonsProps) {
  const [hover, setHover] = useState(false);

  const { user, setUser } = useAuth();

  const [status, setStatus] = useState(false);

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
              variant="contained"
              sx={{ fontSize: "10px", width: "120px" }}
            >
              Watched
            </Button>
            <Button
              variant="contained"
              sx={{ fontSize: "10px", width: "120px" }}
            >
              Is Watching
            </Button>
            <Button
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
