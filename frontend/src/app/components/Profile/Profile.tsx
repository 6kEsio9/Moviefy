"use client";

import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import TabsButtons from "./TabsButtons";

import * as AuthService from "../../services/AuthService";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const currentUser = AuthService.getUser(0);

  const userId = useParams().id;
  const profileUser = AuthService.getUser(+userId!);

  return (
    <Box sx={{ p: 4 }}>
      <Header currentUser={currentUser} profileUser={profileUser} />
      <TabsButtons currentUser={currentUser} profileUser={profileUser} />
    </Box>
  );
}
