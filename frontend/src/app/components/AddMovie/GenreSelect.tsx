import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Grid } from '@mui/material';

function getStyles(genre: string, genreList: readonly string[], theme: Theme) {
  return {
    fontWeight: genreList.includes(genre)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

interface GenreSelectProps{
  value: string[],
  possibleGenres: string[],
  onChange: (event: SelectChangeEvent<string[]>) => void;
}

export default function GenreSelect({value, possibleGenres, onChange}: GenreSelectProps) {
  const theme = useTheme();

  return (
    <Grid>
      <FormControl sx={{ width: 300 }}>
        <Select
          labelId="genreSelectLabel"
          id="genreSelection"
          multiple
          value={value}
          onChange={onChange}
          input={<OutlinedInput id="selectMultipleChip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {possibleGenres.map((genre) => (
            <MenuItem
              key={genre}
              value={genre}
              style={getStyles(genre, value, theme)}
            >
              {genre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}
