import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import * as MovieService from "../../../../services/MovieService";

interface AgeRatingProps {
  setFilter: React.Dispatch<React.SetStateAction<MovieService.MovieFilers>>
}

export default function AgeRating({ setFilter }: AgeRatingProps) {
  const [openAge, setOpenAge] = React.useState(false);

  const handleClickOpenAge = () => {
    setOpenAge(!openAge);
  };

  const ages = ["<18", ">18"];

  const agesHandler = (e: any) => {
    // const ages = e.currentTarget.textContent;
    // const fetched = async () => {
    //   const res = await MovieService.filterMovies("ages", ages);
    //   // setMovies(res);
    // };
    // fetched();
    setFilter((prevFilter) => {
      return {...prevFilter, year: e.currentTarget.textContent as string === ">18"}
    });
  };

  return (
    <>
      <ListItemButton onClick={handleClickOpenAge}>
        <ListItemText sx={{ pl: 2 }} primary="Age rating" />
        {openAge ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openAge} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {ages.map((x) => (
            <ListItemButton key={x}>
              <ListItemText
                onClick={agesHandler}
                sx={{ pl: 4 }}
                primary={`${x}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}
