'use client'
import { Box, Button, Grid, SelectChangeEvent, Typography } from "@mui/material";
import { useState } from "react";
import InputText from "../components/AddMovie/InputText";
import { Image } from "@mui/icons-material";
import GenreSelect from "../components/AddMovie/GenreSelect";

const possibleGenres = [
  "Action",
  "Comedy",
  "Horror"
]

export default function AddMoviePage(){
  const handleGenreChange = (event: SelectChangeEvent<typeof genre>) => {
    const {
      target: { value },
    } = event;
    setGenre(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const submitMovie = () => {
    console.log(title, summary, year, genre, cast, crew)
}

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState<string[]>([]);
  const [cast, setCast] = useState<string[]>([]);
  const [crew, setCrew] = useState<string[]>([]);
  const [poster, setPoster] = useState('');

  return(
    <div style={{marginTop: "40px", marginLeft: "40px"}}>
      <Typography variant="h2">Add Movie</Typography>
      <Grid container direction={"row"} sx={{mt: "40px", mb: "15px", ml: "100px"}}>
        <Grid size={3}>
          <Box width={300} height={450} sx={{border: 1, borderRadius: "20px", borderColor:"gray"}} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            {poster === '' ? 
              <Image fontSize="large"/> : 
              <img src={poster} style={{width: 300, height: 450}}/>
            }
          </Box>
          <div style={{marginTop: "15px"}}>
            <InputText
              label="Poster Image URL"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              width={300}
            />
          </div>
        </Grid>
        <Grid size={4}>
          <InputText
            label="Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputText
            label="Summary"
            value={summary}
            multiline
            onChange={(e) => setSummary(e.target.value)}
          />
          <InputText
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <Typography>Genres</Typography>
          <GenreSelect
            value={genre}
            onChange={handleGenreChange}
            possibleGenres={possibleGenres}
          />
          <Button
            onClick={submitMovie}
          >Submit</Button>
        </Grid>
        <Grid size={4}>
          <InputText
            label="Cast"
            value={cast}
            onChange={(e) => setCast(e.target.value.split(','))}
            multiline
          />
          <InputText
            label="Crew"
            value={crew}
            onChange={(e) => setCrew(e.target.value.split(','))}
            multiline
          />
        </Grid>
      </Grid>
    </div>
  )
}