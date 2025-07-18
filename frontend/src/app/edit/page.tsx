"use client";

import { useEffect } from "react";
import EditProfile from "../components/Profile/EditProfile/EditProfile";

import { useAuth } from "../hooks/useAuth";
import { redirect } from "next/navigation";

export default function Edit() {
  const { user } = useAuth();

  // useEffect(() => {
  //   if (!user) redirect("/auth");
  // }, [user]);

  return <EditProfile />;
}
