"use client";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useState } from "react";

import * as AuthService from "../services/AuthService";
import { useAuth } from "../hooks/useAuth";
import { redirect } from "next/navigation";

export default function Auth() {
  const [login, setLogin] = useState(true);

  const { onLogin } = useAuth();

  const changeLogin = () => {
    login ? setLogin(false) : setLogin(true);
  };

  const handleAuth = (formData: FormData) => {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirm = formData.get("confirm");

    if (!login) {
      if (password !== confirm) alert("Passwords don't match!");
      AuthService.register({ username, email, password, confirm })
        .then((res) => {
          if (!res.token) return null;
          onLogin(res);
        })
        .catch((err) => console.log(err));
      redirect("/home");
    } else {
      AuthService.login({ username, password })
        .then((res) => {
          if (!res.token) return null;
          onLogin(res);
        })
        .catch((err) => console.log(err));
      redirect("/home");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "full" }}>
      <Paper elevation={5} sx={{ padding: 4, mt: 15 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {login ? "Sign In" : "Sign Up"}
          </Typography>
          <Box component="form" sx={{ mt: 1 }} action={handleAuth}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              autoComplete="username"
              autoFocus
              name="username"
            />
            {login ? null : (
              <TextField
                margin="normal"
                required
                fullWidth
                label="E-mail"
                autoComplete="email"
                autoFocus
                name="email"
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              name="password"
            />
            {login ? null : (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirm"
              />
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
            >
              {login ? "Sign In" : "Sign Up"}
            </Button>
            <Button onClick={changeLogin}>
              {login
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign in"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
