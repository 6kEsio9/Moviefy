"use client";

import { useEffect, useState } from "react";

import ReviewsPageItem from "./ReviewsPageItem";
import { useParams } from "next/navigation";
import { Movie, Review } from "@/app/services/MovieService";
import * as MovieService from "../../../services/MovieService";
import { useAuth } from "@/app/hooks/useAuth";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movie, setMovie] = useState<Movie>();
  const { user } = useAuth();

  const movieId = useParams().id?.toString();

  useEffect(() => {
    const fetched = async () => {
      const movieResult = await MovieService.getMovie(movieId!);
      setMovie(movieResult);
    };
    fetched();
  }, []);

  useEffect(() => {
    if (!movie) return;

    const userReview = movie?.reviews!.find((x) => x.userId === user?.id);

    if (userReview) {
      const filteredReviews = movie?.reviews!.filter(
        (x) => x.userId !== user?.id
      );
      const updatedReviews = [userReview!, ...filteredReviews!];

      setReviews(updatedReviews);
    } else {
      setReviews(movie?.reviews!);
    }
  }, [movie]);

  const displayOnTop = () => {
    const userReview = reviews.find((x) => x.userId === user?.id);

    const filteredReviews = reviews.filter((x) => x.userId !== user?.id);
    const updatedReviews =
      userReview !== undefined
        ? [userReview, ...filteredReviews]
        : filteredReviews;

    setReviews(updatedReviews);
  };

  const sortAscending = () => {
    setReviews([...reviews].sort((a, b) => a.likes.length - b.likes.length));
  };

  const sortDescending = () => {
    setReviews([...reviews].sort((a, b) => b.likes.length - a.likes.length));
  };

  const clearSort = () => {
    displayOnTop();
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
            Sort ↑ by likes
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
            Sort ↓ by likes
          </button>
          <button
            onClick={clearSort}
            style={{
              padding: "8px 12px",
              backgroundColor: "white",
              color: "black",
              border: "solid black",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear sort
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
        {reviews.length > 0 ? (
          movie &&
          reviews.map((review) => (
            <ReviewsPageItem
              key={review.userId}
              review={review}
              movie={movie}
            />
          ))
        ) : (
          <p>Movie has no reviews.</p>
        )}
      </div>
    </div>
  );
}
