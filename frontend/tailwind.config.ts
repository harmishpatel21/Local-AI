import type { Config } from "tailwindcss";
import scrollbar from 'tailwind-scrollbar';
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void-black': '#0a0a0a',
        'electric-blue': '#00f3ff',
        'hot-pink': '#ff00ff',
        'cyber-green': '#00ff9f',
        'cyber-white': '#e0e0e0',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['Inconsolata', 'monospace']
      },
      animation: {
        'pulse-glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 6s linear infinite'
      }
    },
  },
  plugins: [
    scrollbar,
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-thumb-rounded::-webkit-scrollbar-thumb': {
          'border-radius': '9999px',
        }
      })
    })
  ],
} satisfies Config;
