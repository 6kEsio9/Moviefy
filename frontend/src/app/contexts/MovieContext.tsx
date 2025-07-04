"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import * as MovieService from "../services/MovieService";

export type Movie = {
  id: number;
  title: string;
  imageUrl: string;
  year: number;
  avgRating: number;
  genre: string;
  ageRating: number;
};

export type MovieContextType = {
  movies: Movie[];
};

export const MovieContext = createContext<MovieContextType>({ movies: [] });

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    //MovieService.getAll()
    //.then(res => res.json)
    //.catch(err => log)
    setMovies(MovieService.getAll());
  }, []);

  return (
    <MovieContext.Provider value={{ movies }}>{children}</MovieContext.Provider>
  );
}
