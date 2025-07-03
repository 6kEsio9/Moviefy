import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface AgeRatingProps {
  handleClickAge: (age: string) => void;
}

export default function AgeRating({ handleClickAge }: AgeRatingProps) {
  const [openAge, setOpenAge] = React.useState(false);

  const handleClickOpenAge = () => {
    setOpenAge(!openAge);
  };

  const ages = [">18", "<18"];
  return (
    <>
      <ListItemButton onClick={handleClickOpenAge}>
        <ListItemText sx={{ pl: 2 }} primary="Age rating" />
        {openAge ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openAge} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {ages.map((x) => (
            <ListItemButton key={x} onClick={() => handleClickAge(x)}>
              <ListItemText sx={{ pl: 4 }} primary={`${x}`} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}
