"use client";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

import * as MovieSerivce from "../services/MovieService";

export default function AddMoviePage() {
  const submitHandler = (formData: FormData) => {
    const submitData = new FormData();
    submitData.append("title", formData.get("title") || "");
    submitData.append("summary", formData.get("summary") || "");
    submitData.append("startYear", formData.get("year") || "");
    submitData.append("isAdult", formData.get("ageRating") || "");
    submitData.append("director", formData.get("director") || "");
    submitData.append("cast", formData.get("cast") || "");
    submitData.append("crew", formData.get("crew") || "");
    submitData.append("genre", formData.get("genre") || "");

    const posterUrl = formData.get("imageUrl") as File;
    if (posterUrl && posterUrl.size > 0) {
      submitData.append("posterUrl", posterUrl);
    }

    const fetched = async () => {
      const res = await MovieSerivce.addMovie(formData);
      console.log(res);
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
          <TextField required name="genre" label="Genre" />
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
