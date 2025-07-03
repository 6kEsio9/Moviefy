import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function Trending() {
  const [openTrending, setOpenTrending] = React.useState(false);

  const handleClickTrending = () => {
    setOpenTrending(!openTrending);
  };

  return (
    <>
      <ListItemButton onClick={handleClickTrending}>
        <ListItemText primary="Trending" />
        {openTrending ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openTrending} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Last week" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Last month" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Last year" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
