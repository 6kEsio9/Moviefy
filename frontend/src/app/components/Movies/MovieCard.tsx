"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import RatingLine from "./RatingLine";

interface MovieCardProps {
  title: string;
  imageUrl: string;
}

export default function MovieCard({ title, imageUrl }: MovieCardProps) {
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
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "contain",
        }}
      />
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <RatingLine />
        </IconButton>
      </CardActions>
    </Card>
  );
}
