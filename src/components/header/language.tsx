import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '../switchers/switchers';

export default function BasicSelect() {
  const { theme, language, changeLanguage } = useTheme();

  return (
    <Box sx={{ width: 40 }}>
      <FormControl variant='standard' fullWidth>
        <Select
          id="demo-simple-select"
          label="Language"
          value={language}
          onChange={changeLanguage}
          className={`${theme === 'white' ? 'text-white bg-black' : 'text-black bg-white'} md:w-12 rounded-md pl-2`}
        >
          <MenuItem value="pt-BR">Pt</MenuItem>
          <MenuItem value="en-US">En</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
