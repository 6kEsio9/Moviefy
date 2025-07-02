import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function Genre() {
  const [openGenre, setOpenGenre] = React.useState(false);

  const handleClickGenre = () => {
    setOpenGenre(!openGenre);
  };
  return (
    <>
      <ListItemButton onClick={handleClickGenre}>
        <ListItemText sx={{ pl: 2 }} primary="Genre" />
        {openGenre ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openGenre} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton>
            <ListItemText sx={{ pl: 4 }} primary="Horror" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText sx={{ pl: 4 }} primary="Sci-Fi" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText sx={{ pl: 4 }} primary="Romance" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText sx={{ pl: 4 }} primary="Fantasy" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
