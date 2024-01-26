import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '../Switchers';

export default function BasicSelect() {
  const { theme, language, changeLanguage } = useTheme();

  return (
    <Box sx={{ width: 55 }}>
      <FormControl variant='standard' fullWidth>
        <Select
          id="demo-simple-select"
          label="Language"
          value={language}
          onChange={changeLanguage}
          className={`${theme === 'white' ? 'text-white bg-black' : 'text-black bg-white'} rounded pl-2`}
        >
          <MenuItem value="pt-BR">PT</MenuItem>
          <MenuItem value="en-US">EN</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
