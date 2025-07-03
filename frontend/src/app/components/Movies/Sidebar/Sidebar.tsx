import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Trending from "./Trending";
import Filters from "./Filters/Filters";

interface SidebarProps {
  handleClickPopular: () => void;
  handleClickGenre: (genre: string) => void;
  handleClickYear: (year: string) => void;
  handleClickAge: (age: string) => void;
}

export default function NestedList({
  handleClickPopular,
  handleClickGenre,
  handleClickYear,
  handleClickAge,
}: SidebarProps) {
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
        <ListItemText onClick={handleClickPopular} primary="Popular" />
      </ListItemButton>
      <Trending />
      <Filters
        handleClickGenre={handleClickGenre}
        handleClickYear={handleClickYear}
        handleClickAge={handleClickAge}
      />
    </List>
  );
}
