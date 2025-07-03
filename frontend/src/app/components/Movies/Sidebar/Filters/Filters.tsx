import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import Genre from "./Genre";
import Year from "./Year";
import AgeRating from "./AgeRating";

export default function Filters() {
  const [openFilters, setOpenFilters] = React.useState(false);

  const handleClickFilters = () => {
    setOpenFilters(!openFilters);
  };

  return (
    <>
      <ListItemButton onClick={handleClickFilters}>
        <ListItemText primary="Filters" />
        {openFilters ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openFilters} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Genre />
          <Year />
          <AgeRating />
        </List>
      </Collapse>
    </>
  );
}
