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
    },
  },
  plugins: [],
};
export default config;
