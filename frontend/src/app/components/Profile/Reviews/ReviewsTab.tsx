import { UserProfile } from "@/app/services/AuthService";

import { Box } from "@mui/material";

import Review from "./Review";
import React, { useEffect, useState } from "react";
import * as AuthService from "@/app/services/AuthService";

interface ReviewProps {
  profileUser: UserProfile | undefined;
}

export default function Reviews({ profileUser }: ReviewProps) {
  const [reviews, setReviews] = useState<
    AuthService.ReviewUser[] | undefined
  >();

  useEffect(() => {
    const fetched = async () => {
      const res = await AuthService.getReviews(profileUser?.id!);
      console.log(res);
      setReviews(res.data);
    };
    fetched();
  }, []);

  return (
    <Box>
      {reviews &&
        reviews.map((review) => {
          return (
            <Review
              key={review.username}
              review={review}
              profileUser={profileUser}
              setReviews={setReviews}
            />
          );
        })}
    </Box>
  );
}
