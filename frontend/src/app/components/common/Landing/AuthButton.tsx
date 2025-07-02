import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import Link from "next/link";

export default function AuthButton() {
  return (
    <Stack spacing={2} direction="row" style={{ marginTop: "2ch" }}>
      <Link href="/auth">
        <Button style={{ width: "25ch" }} variant="contained">
          Sign in
        </Button>
      </Link>
    </Stack>
  );
}
