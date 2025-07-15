import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "../../../../services/MovieService";

interface YearProps {
  setFilter: React.Dispatch<React.SetStateAction<MovieService.MovieFilers>>
}

export default function Year({ setFilter }: YearProps) {
  const [openYear, setOpenYear] = React.useState(false);

  const handleClickOpenYear = () => {
    setOpenYear(!openYear);
  };

  const years = ["Oldest", "Newest"];

  const yearHandler = (e: any) => {
    // const year = e.currentTarget.textContent.toLowerCase();
    // const fetched = async () => {
    //   const res = await MovieService.filterMovies("year", year);
    //   // setMovies(res);
    // };
    // fetched();
    setFilter((prevFilter) => {
      return {...prevFilter, year: e.currentTarget.textContent.toLowerCase() as string === "newest"}
    });
  };

  return (
    <>
      <ListItemButton onClick={handleClickOpenYear}>
        <ListItemText sx={{ pl: 2 }} primary="Year" />
        {openYear ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openYear} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {years.map((x) => (
            <ListItemButton key={x}>
              <ListItemText
                onClick={yearHandler}
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
