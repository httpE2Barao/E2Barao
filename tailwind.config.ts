import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#000000',
        'light': '#ffffff',
        'azul-claro': '#00FFFF',
        'azul-pastel': '#8FFFFF',
        'verde': '#00FF1A',
        'amarelo': 'FFC700',
      },
      screens: {
        '2k': '1440px',
        '4k': '2560px', 
        'ultrawide': '3300px',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
export default config;
