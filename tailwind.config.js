/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        stageBackground: '#F5F5F5',
        stageSidebar: '#A0696B',
        stageCard: '#FFFFFF',
        stageBorder: '#8B5A5A',
        stageButton: '#A68C2C',
        stageText: '#333333',
        stageMuted: '#888888',
      }
    },
  },
  plugins: [],
}
