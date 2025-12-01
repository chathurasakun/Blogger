import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Ensure all theme gradient classes are included
    {
      pattern: /(from|via|to)-(emerald|violet|blue|orange|rose|cyan|sky|purple|fuchsia|indigo|pink|amber|yellow)-(300|400|500)/,
    },
    {
      pattern: /(bg|text|border|shadow|ring)-(emerald|violet|blue|orange|rose|cyan|sky|purple|fuchsia|indigo|pink|amber|yellow)-(300|400|500)/,
    },
    {
      pattern: /(focus|hover|focus-visible):(border|ring|shadow|bg|text)-(emerald|violet|blue|orange|rose|cyan|sky|purple|fuchsia|indigo|pink|amber|yellow)-(300|400|500)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;

