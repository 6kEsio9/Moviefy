"use client";

import React from "react";
import { Box } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import TabsButtons from "./TabsButtons";

import * as AuthService from "../../services/AuthService";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const userId = useParams().id;
  const profileUser = AuthService.getUser(+userId!);

  return (
    <Box sx={{ p: 4 }}>
      <ProfileHeader profileUser={profileUser} />
      <TabsButtons profileUser={profileUser} />
    </Box>
  );
}
