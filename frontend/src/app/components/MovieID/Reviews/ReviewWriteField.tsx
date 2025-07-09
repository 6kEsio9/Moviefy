'use client'
import { useAuth } from "@/app/hooks/useAuth";
import { Box, Button, Container, Rating, TextField, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewWriteField(){
  const { user, setUser } = useAuth();
  const movieId = useParams().id;
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if(!user?.reviews.includes(+movieId!)){
      setShouldRender(true);
    }
  }, [])

  return(
    <Container>
      {shouldRender ?
      <Box>
        <Typography variant="h5" color="gray">{user === undefined ? "Sign in to write a review" : "Write a review"}</Typography>
        <Rating disabled={user === undefined}/>
        <TextField
        fullWidth
        multiline
        disabled={user === undefined}
        rows={5}/>
        <Button variant="contained" disabled={user === undefined} sx={{mt: 2}}>Post</Button>
      </Box>
      
      : <></>}
    </Container>
  )
}