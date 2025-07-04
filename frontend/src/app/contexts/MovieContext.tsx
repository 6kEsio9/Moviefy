"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import * as MovieService from "../services/MovieService";
import { Movie } from "../services/MovieService";

export type MovieContextType = {
  movies: Movie[];
  setMovies: (value: Movie[]) => void;
};

export const MovieContext = createContext<MovieContextType>({
  movies: [],
  setMovies: () => {},
});

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    //MovieService.getAll()
    //.then(res => setMovies(res.movies))
    //.catch(err => log)
    setMovies(MovieService.getAll());
  }, []);

  return (
    <MovieContext.Provider value={{ movies, setMovies }}>
      {children}
    </MovieContext.Provider>
  );
}
