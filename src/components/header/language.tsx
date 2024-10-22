import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '../switchers/switchers';

export default function BasicSelect() {
  const { theme, language, changeLanguage } = useTheme();

  return (
    <div>
      <FormControl variant='standard' fullWidth>
        <Select
          id="demo-simple-select"
          label="Language"
          value={language}
          onChange={changeLanguage}
          className={`${
            theme === 'white' ? 'text-white bg-black' : 'text-black bg-white'
            } text-sm max-md:w-14 max-md:h-7 md:w-14 rounded-md pl-2`}
            >
          <MenuItem value="pt-BR">Pt</MenuItem>
          <MenuItem value="en-US">En</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
