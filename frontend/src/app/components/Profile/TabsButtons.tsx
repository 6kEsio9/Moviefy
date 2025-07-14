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
      console.log(res);
      setWatchList(res.data);
    };
    fetched();
  }, [profileUser]);

  return (
    <>
      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} centered>
        <Tab label="Watchlist" />
        <Tab label="Reviews" />
      </Tabs>

      <Box mt={4}>
        {watchList && tab === 0 && (
          <Box>
            <Section
              title="🎬 Watched"
              watchStatus="watched"
              movies={watchList.watched}
              profileUser={profileUser}
              setWatchList={setWatchList}
            />
            <Section
              title="⏳ Is Watching"
              watchStatus="watching"
              movies={watchList.isWatching}
              profileUser={profileUser}
              setWatchList={setWatchList}
            />
            <Section
              title="📌 Will Watch"
              watchStatus="plan"
              movies={watchList.willWatch}
              profileUser={profileUser}
              setWatchList={setWatchList}
            />
          </Box>
        )}

        {tab === 1 && <Reviews profileUser={profileUser} />}
      </Box>
    </>
  );
}
