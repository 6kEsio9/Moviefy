"use client";

import React from "react";
import { Box } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import TabsButtons from "./TabsButtons";

export default function ProfilePage() {
  return (
    <Box sx={{ p: 4 }}>
      <ProfileHeader />
      <TabsButtons />
    </Box>
  );
}
