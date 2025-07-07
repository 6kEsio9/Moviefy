import { CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import { Movie } from "@/app/services/MovieService";
import { useState } from "react";
import { User } from "@/app/services/AuthService";

interface CardButtonsProps {
  movie: Movie;
  currentUser: User | undefined;
  profileUser: User | undefined;
}

export default function SectionButtons({
  currentUser,
  profileUser,
  movie,
}: CardButtonsProps) {
  const [hover, setHover] = useState(false);

  return (
    <CardContent
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {currentUser?.id === profileUser?.id && hover ? (
        <div>
          <Button
            variant="contained"
            sx={{ fontSize: "10px", width: "120px", mt: "15px" }}
          >
            Edit status
          </Button>
          <Button variant="outlined" sx={{ fontSize: "10px", width: "120px" }}>
            Remove
          </Button>
        </div>
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
