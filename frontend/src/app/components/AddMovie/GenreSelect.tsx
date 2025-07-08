import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface GenreSelectProps{
  value: string,
  possibleGenres: string[],
  onChange: (event: SelectChangeEvent) => void;
}

export default function GenreSelect({value, possibleGenres, onChange}: GenreSelectProps) {
  return (
    <Box mb={2}>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={onChange}
        >
          {possibleGenres.map((genre) => (
            <MenuItem
              key={genre}
              value={genre}
            >
              {genre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
