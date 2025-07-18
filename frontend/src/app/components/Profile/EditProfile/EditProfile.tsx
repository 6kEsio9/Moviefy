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
import { CloudUpload } from "@mui/icons-material";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import * as AuthService from "../../../services/AuthService";
import styled from "@emotion/styled";

export default function EditProfile() {
  const { user } = useAuth();
  const authToken = localStorage.getItem("user");

  const [editUser, setEditUser] = useState<UserProfile>();

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  useEffect(() => {
    if (!user) return;
    const fetched = async () => {
      const res = await AuthService.getUser(user.id);
      console.log(res);
      setEditUser(res.data);
    };
    fetched();
  }, [user]);

  const onSubmitHandler = async (formData: FormData) => {
    const newPassword = formData.get("password")?.toString() || "";
    const confirm = formData.get("confirm")?.toString() || "";

    if (newPassword !== confirm) {
      alert("Passwords don't match!");
      return;
    }

    const submitData = new FormData();
    submitData.append("username", formData.get("username") || "");
    submitData.append("email", formData.get("email") || "");
    submitData.append("bio", formData.get("bio") || "");
    submitData.append("password", newPassword);
    submitData.append("confirm", confirm);

    const pfp = formData.get("pfp") as File;
    if (pfp && pfp.size > 0) {
      submitData.append("pfp", pfp);
    }

    const fetched = async () => {
      const res = await AuthService.editUser(submitData);
      console.log(res);
      redirect(`/profile/${editUser?.id}`);
    };
    fetched();
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
              value={editUser && editUser.email}
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

            <Button
              fullWidth
              component="label"
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUpload />}
              sx={{ mt: 1, mb: 1, padding: 2 }}
            >
              Upload Profile Picture
              <VisuallyHiddenInput accept="image/*" name="pfp" type="file" />
            </Button>

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
