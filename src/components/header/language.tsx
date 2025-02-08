import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '../switchers/switchers';

export default function LanguageSelector() {
  const { theme, language, changeLanguage } = useTheme();

  return (
    <FormControl variant="standard" size="small">
      <Select
        value={language}
        onChange={changeLanguage}
        className={`${
          theme === 'light' ? 'text-black bg-white' : 'text-white bg-white'
        } text-sm rounded-md min-w-[50px] h-8 pl-2`}
        MenuProps={{
          PaperProps: {
            className: theme === 'light' ? 'bg-white' : 'bg-black'
          }
        }}
      >
        <MenuItem value="pt-BR">Pt</MenuItem>
        <MenuItem value="en-US">En</MenuItem>
      </Select>
    </FormControl>
  );
}
