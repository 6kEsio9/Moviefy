"use client";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";

import * as AuthService from "../services/AuthService";
import { useAuth } from "../hooks/useAuth";
import { redirect } from "next/navigation";

export default function Auth() {
  const [login, setLogin] = useState(true);

  const { user, onLogin } = useAuth();

  const changeLogin = () => {
    login ? setLogin(false) : setLogin(true);
  };

  const handleAuth = (formData: FormData) => {
    const username = formData.get("username")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirm = formData.get("confirm")?.toString() || "";

    if (!login) {
      if (password !== confirm) alert("Passwords don't match!");
      const fetched = async () => {
        const res = await AuthService.register({
          username,
          email,
          password,
        });
        if (res.status === 200) setLogin(true);
      };
      fetched();
      // if (user) redirect("/home");
    } else {
      const fetched = async () => {
        const res = await AuthService.login({
          username,
          password,
        });
        onLogin(
          res.data.Token.accessToken,
          {
            id: res.data.id,
            username: res.data.username,
            pfp: res.data.pfp,
          },
          res.data.Token.refreshToken
        );
      };
      fetched();
      if (user) redirect("/home");
    }
  };

  useEffect(() => {
    if (user) redirect("/");
  }, [user]);

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
          {!user ? (
            <>
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
            </>
          ) : (
            <Typography component="h1" variant="h5">
              You are already signed in
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
