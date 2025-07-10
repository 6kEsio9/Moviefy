import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Section from "./Section";
import Reviews from "./Reviews/ReviewsTab";

import { UserProfile, WatchList } from "@/app/services/AuthService";
import * as AuthService from "../../services/AuthService";

interface TabsButtonsProps {
  profileUser: UserProfile | undefined;
}

export default function TabsButtons({ profileUser }: TabsButtonsProps) {
  const [tab, setTab] = useState(0);

  const [watchList, setWatchList] = useState<WatchList>();

  useEffect(() => {
    const fetched = async () => {
      const res = await AuthService.getWatchList(profileUser?.id!);
      setWatchList(res);
    };
    fetched();
  }, []);

  return (
    <>
      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} centered>
        <Tab label="Watchlist" />
        <Tab label="Reviews" />
      </Tabs>

      <Box mt={4}>
        {tab === 0 && (
          <Box>
            <Section
              title="🎬 Watched"
              movies={watchList?.watched}
              profileUser={profileUser}
            />
            <Section
              title="⏳ Is Watching"
              movies={watchList?.isWatching}
              profileUser={profileUser}
            />
            <Section
              title="📌 Will Watch"
              movies={watchList?.willWatch}
              profileUser={profileUser}
            />
          </Box>
        )}

        {tab === 1 && <Reviews profileUser={profileUser} />}
      </Box>
    </>
  );
}
