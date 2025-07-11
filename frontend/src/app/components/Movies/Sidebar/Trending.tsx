import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "../../../services/MovieService";

interface TrendingProps {
  setMovies: React.Dispatch<React.SetStateAction<Movie[] | undefined>>;
}

export default function Trending({ setMovies }: TrendingProps) {
  const [openTrending, setOpenTrending] = React.useState(false);

  const handleClickTrending = () => {
    setOpenTrending(!openTrending);
  };

  const lastWeekHandler = () => {
    const fetched = async () => {
      const res = await MovieService.filterMovies("trending", "lastWeek");
      setMovies(res);
    };
    fetched();
  };

  const lastMonthHandler = () => {
    const fetched = async () => {
      const res = await MovieService.filterMovies("trending", "lastMonth");
      setMovies(res);
    };
    fetched();
  };

  const lastYearHandler = () => {
    const fetched = async () => {
      const res = await MovieService.filterMovies("trending", "lastYear");
      setMovies(res);
    };
    fetched();
  };

  return (
    <>
      <ListItemButton onClick={handleClickTrending}>
        <ListItemText primary="Trending" />
        {openTrending ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openTrending} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Last week" onClick={lastWeekHandler} />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Last month" onClick={lastMonthHandler} />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Last year" onClick={lastYearHandler} />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
