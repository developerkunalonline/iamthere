/**
 * Tailwind CSS Configuration
 * 
 * This file configures TailwindCSS for our Watch Together application.
 * We extend the default theme with custom colors and enable dark mode.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Content paths - Tailwind will scan these files for class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // Enable dark mode using the 'class' strategy
  // This allows toggling dark mode by adding 'dark' class to html element
  darkMode: 'class',
  
  // Theme customization
  theme: {
    extend: {
      // Custom color palette for our app
      colors: {
        // Primary brand colors - deep purple/violet theme
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Dark theme background colors
        dark: {
          100: '#1e1e2e',
          200: '#181825',
          300: '#11111b',
          400: '#0d0d14',
        },
        // Accent colors for chat bubbles and highlights
        accent: {
          blue: '#3b82f6',
          green: '#10b981',
          pink: '#ec4899',
          orange: '#f97316',
        },
      },
      // Custom font family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // Keyframes for custom animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Custom border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // Custom box shadows for depth
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
      },
    },
  },
  
  // Plugins array - add any Tailwind plugins here
  plugins: [],
};
