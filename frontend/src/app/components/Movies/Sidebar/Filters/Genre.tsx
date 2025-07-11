import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Movie } from "@/app/services/MovieService";
import * as MovieService from "../../../../services/MovieService";

interface GenreProps {
  setMovies: React.Dispatch<React.SetStateAction<Movie[] | undefined>>;
}

export default function Genre({ setMovies }: GenreProps) {
  const [openGenre, setOpenGenre] = React.useState(false);

  const genres = ["Horror", "Sci-Fi", "Comedy", "Fantasy"];

  const handleClickOpenGenre = () => {
    setOpenGenre(!openGenre);
  };

  const genreHandler = (e: any) => {
    const genre = e.currentTarget.textContent.toLowerCase();
    console.log(genre);
    const fetched = async () => {
      const res = await MovieService.filterMovies("genre", genre);
      setMovies(res);
    };
    fetched();
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
