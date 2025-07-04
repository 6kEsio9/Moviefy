import React, { useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box className="flex flex-col items-center mb-6">
      <Avatar src="/images/pfp.jpeg" sx={{ width: 120, height: 120, mb: 2 }} />
      <Typography variant="h5">Username</Typography>
      <Typography variant="body1" color="text.secondary">
        Bio
      </Typography>
    </Box>
  );
}
