import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import * as MovieService from "../../../../services/MovieService";

interface GenreProps {
  setFilter: React.Dispatch<React.SetStateAction<MovieService.MovieFilers>>
}

export default function Genre({ setFilter }: GenreProps) {
  const [openGenre, setOpenGenre] = React.useState(false);

  const genres = ["Horror", "Sci-Fi", "Comedy", "Fantasy"];

  const handleClickOpenGenre = () => {
    setOpenGenre(!openGenre);
  };

  const genreHandler = (e: any) => {
    // const genre = e.currentTarget.textContent.toLowerCase();
    // console.log(genre);
    // const fetched = async () => {
    //   const res = await MovieService.filterMovies(fi);
    //   // setMovies(res);
    // };
    // fetched();
    setFilter((prevFilter) => {
      const genre = e.currentTarget.textContent as string;
      console.log(genre);
      return {...prevFilter, genre: genre}
    });
  };

  return (
    <>
      <ListItemButton onClick={handleClickOpenGenre}>
        <ListItemText sx={{ pl: 2 }} primary="Genre" />
        {openGenre ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openGenre} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {genres.map((x) => (
            <ListItemButton key={x}>
              <ListItemText
                onClick={genreHandler}
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
