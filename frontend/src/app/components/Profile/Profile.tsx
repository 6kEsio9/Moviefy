"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import TabsButtons from "./TabsButtons";
import { useParams } from "next/navigation";
import * as AuthService from "../../services/AuthService";
import { UserProfile } from "../../services/AuthService";
export default function ProfilePage() {
  const [profileUser, setProfileUser] = useState<UserProfile>();

  const userId = useParams().id;

  useEffect(() => {
    const fetched = async () => {
      const res = await AuthService.getUser(String(userId!));
      setProfileUser(res.data);
    };
    fetched();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <ProfileHeader profileUser={profileUser} />
      <TabsButtons profileUser={profileUser} />
    </Box>
  );
}
