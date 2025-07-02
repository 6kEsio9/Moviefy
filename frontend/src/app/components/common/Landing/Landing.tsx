import * as React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import AuthButton from "./AuthButton";

export default function Landing() {
  return (
    <>
      <Box
        id="main"
        sx={{
          height: "80vh",
        }}
      >
        <Box
          sx={{
            height: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Stack
            component="form"
            sx={{
              width: "85ch",
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <TextField
              hiddenLabel
              id="filled-hidden-label-normal"
              variant="filled"
              placeholder="Search movie"
            />
          </Stack>
          <AuthButton />
        </Box>
      </Box>
    </>
  );
}
