/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#130d12",
        primary: "#c8b1c7",
        secondary: "#664752",
        textColor: "#eee7ee",
      },
    },
  },
  plugins: [],
};
