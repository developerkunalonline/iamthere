/**
 * Vite Configuration File
 * 
 * This configures the Vite build tool for our React application.
 * Vite provides fast Hot Module Replacement (HMR) and optimized builds.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Export the Vite configuration
export default defineConfig({
  // Plugins array - we use the React plugin for JSX transformation and Fast Refresh
  plugins: [react()],
  
  // Development server configuration
  server: {
    // Port to run the dev server on
    port: 3000,
    // Automatically open the browser when starting the dev server
    open: true,
    // Host configuration for network access
    host: true,
  },
  
  // Build configuration
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for debugging
    sourcemap: true,
  },
  
  // Resolve configuration for module aliases
  resolve: {
    alias: {
      // Allow imports starting with '@' to resolve to 'src' folder
      '@': '/src',
    },
  },
});
