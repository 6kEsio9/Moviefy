import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import { Movie } from "@/app/contexts/MovieContext";

interface SearchMenuProps {
  movies: Movie[];
}

export default function SearchMenu({ movies }: SearchMenuProps) {
  return (
    <List
      sx={{
        width: "95.7%",
        bgcolor: "background.paper",
        ml: "2.15%",
        position: "absolute",
        zIndex: "10",
        color: "black",
      }}
    >
      {movies.map((x) => (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <img
                style={{ width: "100%", height: "100%" }}
                src={x.imageUrl}
                alt={x.title}
              ></img>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={x.title} secondary={`Premiere: ${x.year}`} />
        </ListItem>
      ))}
    </List>
  );
}
