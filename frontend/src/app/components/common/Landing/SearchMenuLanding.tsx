import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Movie } from "@/app/services/MovieService";
import Link from "next/link";

interface SearchMenuProps {
  movies: Movie[];
}

export default function SearchMenuLanding({ movies }: SearchMenuProps) {
  return (
    <List
      sx={{
        width: "44.3%",
        bgcolor: "#ededed",
        ml: "2.15%",
        zIndex: "10",
        color: "black",
        maxHeight: 350,
        overflowY: "auto",
        position: "absolute",
        top: "40%",
        left: "25.7%",
      }}
    >
      {movies.map((x) => (
        <Link
          style={{ textDecoration: "none", color: "black" }}
          href={`/movies/${x.id}`}
        >
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
        </Link>
      ))}
    </List>
  );
}
