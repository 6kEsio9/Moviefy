import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Trending from "./Trending";
import Filters from "./Filters/Filters";
import { Movie } from "@/app/services/MovieService";

interface NestedListProps {
  setMovies: React.Dispatch<React.SetStateAction<Movie[] | undefined>>;
}

export default function NestedList({ setMovies }: NestedListProps) {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        mt: "15px",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton>
        <ListItemText primary="Popular" />
      </ListItemButton>
      <Trending setMovies={setMovies} />
      <Filters setMovies={setMovies} />
    </List>
  );
}
