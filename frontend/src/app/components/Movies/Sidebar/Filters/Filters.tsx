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
import { MovieFilers } from "@/app/services/MovieService";

interface FiltersProps {
  setFilter: React.Dispatch<React.SetStateAction<MovieFilers>>
}

export default function Filters({ setFilter }: FiltersProps) {
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
          <Genre setFilter={setFilter}/>
          <Year setFilter={setFilter} />
          <AgeRating setFilter={setFilter} />
        </List>
      </Collapse>
    </>
  );
}
