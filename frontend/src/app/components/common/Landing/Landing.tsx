"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import AuthButton from "./AuthButton";
import SearchMenuLanding from "./SearchMenuLanding";

import * as MovieService from "../../../services/MovieService";
import { Movie } from "@/app/contexts/MovieContext";

export default function Landing() {
  const [input, setInput] = React.useState("");
  const [debouncedInput, setDebouncedInput] = React.useState("");
  const [movies, setMovies] = React.useState<Movie[]>([]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  React.useEffect(() => {
    if (debouncedInput) {
      const result = MovieService.search(debouncedInput);
      setMovies(result);
    }
  }, [debouncedInput]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <>
      <Box
        id="main"
        sx={{
          height: "80vh",
        }}
      >
        <Box
          sx={{
            height: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Stack
            component="form"
            sx={{
              width: "85ch",
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <TextField
              hiddenLabel
              id="filled-hidden-label-normal"
              variant="filled"
              placeholder="Search movie"
              onChange={handleSearch}
            />
          </Stack>
          {movies.length > 0 && debouncedInput && (
            <SearchMenuLanding movies={movies} />
          )}
          <AuthButton />
        </Box>
      </Box>
    </>
  );
}
