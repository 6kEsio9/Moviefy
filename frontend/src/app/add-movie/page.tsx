"use client";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Image } from "@mui/icons-material";
import GenreSelect from "../components/AddMovie/GenreSelect";
import { getGenreList, addMovie } from "../services/MovieService";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function AddMoviePage() {
  const possibleGenres = getGenreList();

  const { user } = useAuth();

  // useEffect(() => {
  //   if (user?.username !== "Todor") redirect("/");
  // }, []);

  const submitHandler = (formData: FormData) => {
    const imageUrl = formData.get("imageUrl")?.toString() || "";
    const title = formData.get("title")?.toString() || "";
    const summary = formData.get("summary")?.toString() || "";
    const year = Number(formData.get("year")?.toString() || "");
    const ageRating = Number(formData.get("ageRating")?.toString() || "");
    const director = formData.get("director")?.toString() || "";
    const cast = (formData.get("cast")?.toString() || "").split(", ");
    const crew = (formData.get("crew")?.toString() || "").split(", ");

    const fetched = async () => {
      await addMovie(user?.id!, {
        imageUrl,
        title,
        summary,
        year,
        ageRating,
        director,
        cast,
        crew,
      }).catch((err) => console.log(err));
    };
    fetched();
  };

  return (
    <Box
      component="form"
      action={submitHandler}
      style={{ marginTop: "40px", marginLeft: "10%" }}
    >
      <Typography variant="h2">Add Movie</Typography>

      <Grid container direction={"row"} sx={{ mt: "40px", mb: "15px" }}>
        <Grid size={3} width={300} marginRight={5}>
          <Box
            width={300}
            height={450}
            sx={{
              border: 0,
              borderRadius: "20px",
              borderColor: "gray",
            }}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {/* {poster === "" ? (
              <Image fontSize="large" />
            ) : (
              <img src={poster} style={{ width: 300, height: 450 }} />
            )} */}
          </Box>
          <div style={{ marginTop: "15px" }}>
            <TextField required name="imageUrl" label="Poster Image URL" />
          </div>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} marginRight={4}>
          <TextField required name="title" label="Movie Title" />
          <TextField required name="summary" label="Summary" multiline />
          <TextField required name="year" label="Year" />
          <TextField required name="ageRating" label="Age rating" />
          <Typography>Genre</Typography>
          <GenreSelect possibleGenres={possibleGenres} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} marginRight={4}>
          <TextField required name="director" label="Director" />
          <TextField required name="cast" label="Cast" multiline />
          <TextField required name="crew" label="Crew" multiline />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 100,
              marginBottom: 100,
            }}
          >
            <Button
              sx={{ fontSize: 32, backgroundColor: "#1976d2", color: "white" }}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
