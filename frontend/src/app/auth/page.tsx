'use client'
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper
} from '@mui/material';
import { useState } from 'react';

export default function Auth() {
  const [login, setLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changeLogin = () => {
    login ? setLogin(false) : setLogin(true);
  }

  const handleAuth = () => {
    if(!login && password !== confirmPassword){
      alert("Password and confirm password do not match")
    }

    //TODO
  }

  return (
    <Container maxWidth="xs" sx={{display: "full"}}>
      <Paper elevation={5} sx={{ padding: 4, mt: 15 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            {login ? "Sign In" : "Sign Up"}
          </Typography>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              autoComplete="username"
              autoFocus
            />
            {login ? null : <TextField
              margin="normal"
              required
              fullWidth
              label="E-mail"
              autoComplete="email"
              autoFocus
            />}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={(e) => {setPassword(e.target.value)}}
            />
            {login ? null : <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              onChange={(e) => {setConfirmPassword(e.target.value)}}
            />}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleAuth}
            >
              {login ? "Sign In" : "Sign Up"}
            </Button>
            <Button onClick={changeLogin}>
              {login ? "Don't have an account? Sign Up" : "Already have an account? Sign in"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}