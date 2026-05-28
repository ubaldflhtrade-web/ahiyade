import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ahiyade: {
          cream: "#f6ead7",
          sand: "#ddc49f",
          clay: "#9b5d35",
          cocoa: "#4f2f1b",
          palm: "#1f7a5a",
          lagoon: "#147c87",
          sun: "#f2b84b",
          coral: "#cf5a46",
          ink: "#241810"
        }
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(79, 47, 27, 0.13)"
      }
    }
  },
  plugins: []
};

export default config;
