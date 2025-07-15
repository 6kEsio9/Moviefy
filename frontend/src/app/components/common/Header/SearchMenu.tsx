import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { SearchMovie, SearchUser } from "@/app/services/MovieService";
import Link from "next/link";
import { User } from "@/app/services/AuthService";

interface SearchMenuProps {
  movies: SearchMovie[];
  users: SearchUser[];
}

export default function SearchMenu({ movies, users }: SearchMenuProps) {
  return (
    <List
      sx={{
        width: "95.7%",
        bgcolor: "background.paper",
        ml: "2.15%",
        position: "absolute",
        zIndex: "11",
        color: "black",
        maxHeight: 350,
        overflowY: "auto",
      }}
    >
      {movies && movies.length > 0 && (
        <div
          style={{
            width: "90%",
            fontFamily: "sans-serif",
            marginLeft: "15px",
          }}
        >
          Movies
        </div>
      )}
      {movies &&
        movies.map((x) => (
          <Link
            key={x.id}
            style={{ textDecoration: "none", color: "black" }}
            href={`/movies/${x.id}`}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={x.posterUrl}
                    alt={x.title}
                  ></img>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={x.title}
                secondary={`Premiere: ${x.startYear}`}
              />
            </ListItem>
          </Link>
        ))}
      {users && users.length > 0 && (
        <div
          style={{
            width: "90%",
            fontFamily: "sans-serif",
            marginLeft: "15px",
          }}
        >
          Users
        </div>
      )}

      {users &&
        users.map((x) => (
          <Link
            style={{ textDecoration: "none", color: "black" }}
            href={`/profile/${x.id}`}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={x.pfpUrl}
                    alt={x.username}
                  ></img>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={x.username} />
            </ListItem>
          </Link>
        ))}
    </List>
  );
}
