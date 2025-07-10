"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import RatingLine from "./RatingLine";
import Link from "next/link";

interface MovieCardProps {
  id: string;
  title: string;
  imageUrl: string;
}

export default function MovieCard({ id, title, imageUrl }: MovieCardProps) {
  const [hover, setHover] = React.useState(false);

  return (
    <Card
      sx={{
        width: "320px",
        height: "450px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        m: "15px 15px 15px 15px",
      }}
    >
      <Link href={`/movies/${id}`} style={{ textDecoration: "none" }}>
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "contain",
              filter: hover ? "brightness(50%)" : "",
              transition: "filter 0.25s ease-in",
            }}
          />
          {hover && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
                top: "40%",
                color: "white",
                fontSize: "250%",
              }}
            >
              {title}
            </div>
          )}
        </div>
      </Link>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <RatingLine movieId={id} />
        </IconButton>
      </CardActions>
    </Card>
  );
}
