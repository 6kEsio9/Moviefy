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

interface FiltersProps {
  handleClickGenre: (genre: string) => void;
  handleClickYear: (year: string) => void;
  handleClickAge: (age: string) => void;
}

export default function Filters({
  handleClickGenre,
  handleClickYear,
  handleClickAge,
}: FiltersProps) {
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
          <Genre handleClickGenre={handleClickGenre} />
          <Year handleClickYear={handleClickYear} />
          <AgeRating handleClickAge={handleClickAge} />
        </List>
      </Collapse>
    </>
  );
}
