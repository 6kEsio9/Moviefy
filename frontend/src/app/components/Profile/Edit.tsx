import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function Edit() {
  return (
    <Stack spacing={2} direction="row" sx={{ mt: "30px" }}>
      <Button variant="contained">Edit profile</Button>
    </Stack>
  );
}
