import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function AgeRating() {
  const [openAge, setOpenAge] = React.useState(false);

  const handleClickAge = () => {
    setOpenAge(!openAge);
  };

  return (
    <>
      <ListItemButton onClick={handleClickAge}>
        <ListItemText sx={{ pl: 2 }} primary="Age rating" />
        {openAge ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openAge} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton>
            <ListItemText sx={{ pl: 4 }} primary="<18" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText sx={{ pl: 4 }} primary=">18" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
