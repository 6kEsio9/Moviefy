import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
// import Trending from "./Trending";
import Filters from "./Filters/Filters";
import { MovieFilers } from "@/app/services/MovieService";

interface NestedListProps {
  setFilter: React.Dispatch<React.SetStateAction<MovieFilers>>
}

export default function NestedList({ setFilter }: NestedListProps) {
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
      {/* <Trending setMovies={setMovies} /> */}
      <Filters setFilter={setFilter} />
    </List>
  );
}
