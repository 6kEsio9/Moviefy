"use client";

import { useAuth } from "@/app/hooks/useAuth";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { redirect } from "next/navigation";

export default function EditProfile() {
  const { user, setUser } = useAuth();

  const onSubmitHandler = (formData: FormData) => {
    const username = formData.get("username")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";
    const pfp = formData.get("pfp")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirm = formData.get("confirm")?.toString() || "";

    if (user) {
      setUser({ ...user, username, email, bio, pfp, id: user?.id });
    }

    console.log(user);

    // redirect(`/profile/${user?.id}`);
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
              defaultValue={user?.username}
              placeholder="Username"
            />
            <TextField
              name="email"
              margin="normal"
              fullWidth
              autoComplete="email"
              autoFocus
              defaultValue={user?.email}
              placeholder="Email"
            />

            <TextField
              name="bio"
              margin="normal"
              fullWidth
              autoFocus
              autoComplete="off"
              defaultValue={user?.bio}
              placeholder="Bio"
            />

            <TextField
              name="pfp"
              margin="normal"
              fullWidth
              autoComplete="off"
              autoFocus
              defaultValue={user?.pfp}
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
