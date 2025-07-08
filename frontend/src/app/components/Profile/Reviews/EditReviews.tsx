import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface EditReviewsProps {
  comment: string | undefined;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditReviews({ comment, setEdit }: EditReviewsProps) {
  const onSubmitHandler = (event: any) => {
    event?.preventDefault();
    console.log(comment);
    setEdit(false);
    //fetch...
  };

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        defaultValue={comment}
      />
    </Box>
  );
}
