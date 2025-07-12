import React, { useEffect, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import Edit from "./Edit";
import { useAuth } from "@/app/hooks/useAuth";

import { UserProfile } from "../../services/AuthService";

interface ProfileHeaderProps {
  profileUser: UserProfile | undefined;
}

export default function ProfileHeader({ profileUser }: ProfileHeaderProps) {
  const { user } = useAuth();

  return (
    <Box className="flex flex-col items-center mb-6">
      <Avatar src={profileUser?.pfp} sx={{ width: 120, height: 120, mb: 2 }} />
      <Typography variant="h5">{profileUser?.username}</Typography>
      <Typography variant="body1" color="text.secondary">
        {profileUser?.bio}
      </Typography>
      {user && user?.id === profileUser?.id && <Edit />}
    </Box>
  );
}
