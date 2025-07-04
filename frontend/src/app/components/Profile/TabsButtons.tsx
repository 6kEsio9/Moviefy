import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Section from "./Section";

export default function TabsButtons() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} centered>
        <Tab label="Watchlist" />
        <Tab label="Reviews" />
      </Tabs>

      <Box mt={4}>
        {tab === 0 && (
          <Box>
            <Section title="🎬 Watched" movies={[]} />
            <Section title="⏳ Is Watching" movies={[]} />
            <Section title="📌 Will Watch" movies={[]} />
          </Box>
        )}

        {tab === 1 && (
          <Box>
            {/* {user.reviews.map((r, i) => {
                  const movie = getMovieById(r.movieId);
                  if (!movie) return null;
                  return (
                    <Card key={i} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{movie.title}</Typography>
                        <Rating value={r.rating} readOnly />
                        <Typography variant="body2">{r.comment}</Typography>
                      </CardContent>
                    </Card>
                  );
                })} */}
          </Box>
        )}
      </Box>
    </>
  );
}
