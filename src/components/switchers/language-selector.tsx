import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '../switchers/switchers';

// Usando 'export default' para o componente principal do arquivo
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
        <MenuItem value="pt">PT</MenuItem>
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="es">ES</MenuItem>
        <MenuItem value="fr">FR</MenuItem>
        <MenuItem value="zh">ZH</MenuItem>
      </Select>
    </FormControl>
  );
}