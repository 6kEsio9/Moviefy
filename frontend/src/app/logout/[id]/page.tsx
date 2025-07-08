"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { redirect } from "next/navigation";

export default function Logout() {
  const { user, setUser } = useAuth();

  setUser(undefined);

  redirect("/");
}
