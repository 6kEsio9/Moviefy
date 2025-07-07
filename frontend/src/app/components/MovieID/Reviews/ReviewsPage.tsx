"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import * as MovieService from "../../../services/MovieService";
import * as AuthService from "../../../services/AuthService";

import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Rating,
  Button,
} from "@mui/material";
import { useAuth } from "@/app/hooks/useAuth";

export default function ReviewsPage() {
  const { user, setUser } = useAuth();
  const [ratings, setRatings] = useState<MovieService.Rating[]>([]);

  const params = useParams().id;
  const movie = MovieService.getMovie(+params!);

  useEffect(() => {
    const movieRatings = movie?.ratings;
    setRatings(movieRatings!);
  }, []);

  const sortAscending = () => {
    setRatings([...ratings].sort((a, b) => a.rating - b.rating));
  };

  const sortDescending = () => {
    setRatings([...ratings].sort((a, b) => b.rating - a.rating));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "24px",
        gap: "32px",
        flexWrap: "wrap",
        fontFamily: "sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={movie?.imageUrl}
          alt="Movie Poster"
          style={{
            width: "160px",
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        />
        <h1
          style={{
            marginTop: "16px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {movie?.title}
        </h1>
        <div
          style={{
            marginTop: "24px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button
            onClick={sortAscending}
            style={{
              padding: "8px 12px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sort ↑ by rating
          </button>
          <button
            onClick={sortDescending}
            style={{
              padding: "8px 12px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sort ↓ by rating
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          minWidth: "300px",
        }}
      >
        {ratings.map((x) => (
          <Card key={movie?.id} sx={{ mb: 2, position: "relative" }}>
            <CardContent
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box sx={{ display: "flex" }}>
                <Avatar
                  src={AuthService.getUser(x.userId)?.pfp}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">
                    {AuthService.getUser(x.userId)?.username}
                  </Typography>
                  <Rating value={x.rating} readOnly />
                  {x?.comment && (
                    <Typography variant="body2">{x.comment}</Typography>
                  )}
                </Box>
              </Box>

              {user?.id === x.userId && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="contained"
                    sx={{ fontSize: "10px", width: "120px" }}
                  >
                    Edit comment
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ fontSize: "10px", width: "120px" }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
