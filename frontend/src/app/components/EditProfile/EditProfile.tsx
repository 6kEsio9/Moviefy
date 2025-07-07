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

export default function EditProfile() {
  const { user, setUser } = useAuth();

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
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              fullWidth
              autoComplete="username"
              autoFocus
              defaultValue={user?.username}
              placeholder="Username"
            />
            <TextField
              margin="normal"
              fullWidth
              autoComplete="email"
              autoFocus
              defaultValue={user?.email}
              placeholder="Email"
            />

            <TextField
              margin="normal"
              fullWidth
              autoFocus
              autoComplete="off"
              defaultValue={user?.bio}
              placeholder="Bio"
            />

            <TextField
              margin="normal"
              fullWidth
              autoComplete="off"
              autoFocus
              defaultValue={user?.pfp}
              placeholder="Profile Picture Url"
            />

            <TextField
              margin="normal"
              fullWidth
              label="New Password"
              type="password"
              autoComplete="current-password"
            />

            <TextField
              margin="normal"
              fullWidth
              label="Confirm New Password"
              type="password"
            />

            <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Edit profile
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
