import { useContext } from "react";
import { MovieContext, MovieContextType } from "../contexts/MovieContext";

export function useMovies(): MovieContextType {
  const context = useContext(MovieContext);
  return context;
}
