import { User } from "@/app/services/AuthService";

import { Box } from "@mui/material";

import Review from "./Review";
import { useMovies } from "@/app/hooks/useMovies";

interface ReviewProps {
  profileUser: User | undefined;
}

export default function Reviews({ profileUser }: ReviewProps) {
  const { movies, setMovies } = useMovies();

  return (
    profileUser!.reviews.length > 0 ? (
      <Box>
        {profileUser?.reviews.map((movieId) => {
          const movie = movies.find((x) => x.id === movieId);

          return (
            <Review key={movieId} movie={movie!} profileUser={profileUser} />
          );
        })}
      </Box>
    ) : (
      <div style={{display: "flex", justifyContent:"center"}}>
        <p>User doesn't have reviews in this section.</p>
      </div>
    )
  );
}
