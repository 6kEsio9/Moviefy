import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";

export default function Edit() {
  const { user, setUser } = useAuth();

  return (
    <Stack spacing={2} direction="row" sx={{ mt: "30px" }}>
      <Link href="/edit" style={{ textDecoration: "none" }}>
        <Button variant="contained">Edit profile</Button>
      </Link>
    </Stack>
  );
}
