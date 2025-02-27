import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-custom': 'pulse-custom 2s ease-out infinite',
      },

      keyframes: {
        'pulse-custom': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      screens: {
        'md-lg': '1250px', // Custom breakpoint
      },

      boxShadow: {
        'combined': `
          -0.1rem -0.1rem 0 0 #FFFFFF,
          -0.13rem -0.13rem 0 0 #C2E3BC,
          inset -0.06rem -0.06rem 0 0 #C2E3BC,
          inset -0.06rem -0.06rem 0 0 #FFFFFF
        `,
      },
    },
  },
  plugins: [],
};
export default config;
