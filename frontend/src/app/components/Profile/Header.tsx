import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { User } from "@/app/services/AuthService";
import Edit from "./Edit";

interface HeaderParams {
  currentUser: User | undefined;
  profileUser: User | undefined;
}

export default function Header({ currentUser, profileUser }: HeaderParams) {
  return (
    <Box className="flex flex-col items-center mb-6">
      <Avatar src={profileUser?.pfp} sx={{ width: 120, height: 120, mb: 2 }} />
      <Typography variant="h5">{profileUser?.username}</Typography>
      <Typography variant="body1" color="text.secondary">
        {profileUser?.bio}
      </Typography>
      {currentUser?.id === profileUser?.id && <Edit />}
    </Box>
  );
}
