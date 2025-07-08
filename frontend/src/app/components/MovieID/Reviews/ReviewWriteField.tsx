'use client'
import { useAuth } from "@/app/hooks/useAuth";
import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function ReviewWriteField(){
  const { user, setUser } = useAuth();
  const movieId = useParams().id;

  return(
    !user?.reviews.includes(+movieId!) ?
    <Box>
      <Typography variant="h5" color="gray">{user?.id === -1 ? "Sign in to write a review" : "Write a review"}</Typography>
      <Rating disabled={user?.id === -1}/>
      <TextField
      fullWidth
      multiline
      disabled={user?.id === -1}
      rows={5}/>
      <Button variant="contained" disabled={user?.id === -1} sx={{mt: 2}}>Post</Button>
    </Box>
    
    : <></>
  )
}