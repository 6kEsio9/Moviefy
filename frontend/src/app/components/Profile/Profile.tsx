"use client";

import React from "react";
import { Box } from "@mui/material";
import { useMovies } from "@/app/hooks/useMovies";
import Header from "./Header";
import TabsButtons from "./TabsButtons";

export default function ProfilePage() {
  const { movies, setMovies } = useMovies();

  return (
    <Box sx={{ p: 4 }}>
      <Header />
      {/* Tabs */}
      <TabsButtons />
    </Box>
  );
}
