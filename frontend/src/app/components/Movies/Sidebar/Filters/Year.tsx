import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function Year() {
  const [openYear, setOpenYear] = React.useState(false);

  const handleClickYear = () => {
    setOpenYear(!openYear);
  };

  return (
    <>
      <ListItemButton onClick={handleClickYear}>
        <ListItemText sx={{ pl: 2 }} primary="Year" />
        {openYear ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openYear} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton>
            <ListItemText sx={{ pl: 4 }} primary="Oldest" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText sx={{ pl: 4 }} primary="Newest" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
