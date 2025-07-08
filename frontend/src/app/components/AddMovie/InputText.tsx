import { TextField, Typography, Box, FormControl } from '@mui/material';

interface InputTextProps {
  label: string;
  value: string | number | string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  multiline?: boolean;
  width?: number;
} 

export default function InputText({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
  width = 500
}: InputTextProps) {
  return (
    <Box sx={{ mb: 2}} minWidth={300}>
      <Typography>{label}</Typography>
      <FormControl fullWidth>
        <TextField
          variant="outlined"
          value={value}
          onChange={onChange}
          type={type}
          multiline={multiline}
          rows={multiline ? 4 : 1}
        />
      </FormControl>
    </Box>
  );
}
