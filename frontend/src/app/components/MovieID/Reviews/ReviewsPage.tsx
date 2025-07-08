"use client";

import { useEffect, useState } from "react";

import ReviewsPageItem from "./ReviewsPageItem";
import { useParams } from "next/navigation";
import { Movie, Review } from "@/app/services/MovieService";
import { useMovies } from "@/app/hooks/useMovies";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movie, setMovie] = useState<Movie>();

  const { movies, setMovies } = useMovies();

  const movieId = Number(useParams().id);

  useEffect(() => {
    if (movies.length === 0) return;
    const movieResult = movies.find((x) => x.id === movieId);
    setMovie(movieResult);
    setReviews(movieResult?.reviews!);
  }, [movies]);

  const sortAscending = () => {
    setReviews([...reviews].sort((a, b) => a.rating - b.rating));
  };

  const sortDescending = () => {
    setReviews([...reviews].sort((a, b) => b.rating - a.rating));
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
        {reviews?.map((review) => (
          <ReviewsPageItem key={review.userId} review={review} movie={movie!} />
        ))}
      </div>
    </div>
  );
}
