/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable dark mode support
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',   // blue-600
        accent: '#38BDF8',    // sky-400
        dark: '#0F172A',      // slate-900
        card: '#1E293B',      // slate-800
        text: '#F3F4F6',      // gray-100
        success: '#10B981',   // emerald-500
        error: '#F43F5E',     // rose-500
      },
    },
  },
  plugins: [],
}
