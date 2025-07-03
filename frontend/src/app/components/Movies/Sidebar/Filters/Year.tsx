import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function Year() {
  const [openYear, setOpenYear] = React.useState(false);

  const handleClickOpenYear = () => {
    setOpenYear(!openYear);
  };

  const years = ["Oldest", "Newest"];

  return (
    <>
      <ListItemButton onClick={handleClickOpenYear}>
        <ListItemText sx={{ pl: 2 }} primary="Year" />
        {openYear ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openYear} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {years.map((x) => (
            <ListItemButton key={x}>
              <ListItemText sx={{ pl: 4 }} primary={`${x}`} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}
