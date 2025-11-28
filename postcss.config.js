/**
 * PostCSS Configuration
 * 
 * PostCSS is a tool for transforming CSS with JavaScript plugins.
 * We use it to process TailwindCSS and add vendor prefixes with Autoprefixer.
 */

export default {
  plugins: {
    // TailwindCSS plugin - processes Tailwind directives
    tailwindcss: {},
    // Autoprefixer - adds vendor prefixes for browser compatibility
    autoprefixer: {},
  },
};
