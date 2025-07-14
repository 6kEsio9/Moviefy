"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { UserProfile } from "@/app/services/AuthService";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import * as AuthService from "../../../services/AuthService";

export default function EditProfile() {
  const { user } = useAuth();
  const authToken = localStorage.getItem("user");

  const [editUser, setEditUser] = useState<UserProfile>();

  useEffect(() => {
    if (!user) return;
    const fetched = async () => {
      const res = await AuthService.getUser(user.id);
      console.log(res);
      setEditUser(res.data);
    };
    fetched();
  }, [user]);

  const onSubmitHandler = (formData: FormData) => {
    const username = formData.get("username")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";
    const pfp = formData.get("pfp")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirm = formData.get("confirm")?.toString() || "";

    if (password !== confirm) {
      alert("Passwords don't match!");
      return;
    }

    const fetched = async () => {
      await AuthService.editUser(
        editUser?.id!,
        { username, email, bio, pfp, password, confirm },
        authToken!
      );
    };
    fetched();

    redirect(`/profile/${editUser?.id}`);
  };

  return (
    <Container maxWidth="xs" sx={{ display: "full" }}>
      <Paper elevation={5} sx={{ padding: 4, mt: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5"></Typography>
          <Box component="form" sx={{ mt: 2 }} action={onSubmitHandler}>
            <TextField
              name="username"
              margin="normal"
              fullWidth
              autoComplete="username"
              autoFocus
              defaultValue={editUser && editUser.username}
              placeholder="Username"
              required
            />
            <TextField
              name="email"
              margin="normal"
              fullWidth
              autoComplete="email"
              autoFocus
              defaultValue={editUser && editUser.email}
              placeholder="Email"
              required
            />

            <TextField
              name="bio"
              margin="normal"
              fullWidth
              autoFocus
              autoComplete="off"
              defaultValue={editUser && editUser.bio}
              placeholder="Bio"
            />

            <TextField
              name="pfp"
              margin="normal"
              fullWidth
              autoComplete="off"
              autoFocus
              defaultValue={editUser && editUser.pfp}
              placeholder="Profile Picture Url"
            />

            <TextField
              name="password"
              margin="normal"
              fullWidth
              label="New Password"
              type="password"
              autoComplete="current-password"
            />

            <TextField
              name="confirm"
              margin="normal"
              fullWidth
              label="Confirm New Password"
              type="password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Edit profile
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
