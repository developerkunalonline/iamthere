/**
 * Main Entry Point - main.jsx
 * 
 * This is the entry point of our React application.
 * It initializes React, sets up routing, and mounts the app to the DOM.
 * 
 * The application structure:
 * - React.StrictMode: Enables additional development checks
 * - BrowserRouter: Enables client-side routing
 * - App: Our main application component
 */

// Import React core
import React from 'react';

// Import ReactDOM for rendering to the DOM
import ReactDOM from 'react-dom/client';

// Import BrowserRouter for client-side routing
import { BrowserRouter } from 'react-router-dom';

// Import our main App component
import App from './App';

// Import global styles (includes Tailwind CSS)
import './index.css';

/**
 * Create the root element and render our application
 * 
 * We use createRoot (React 18+) for concurrent rendering features.
 * The app is wrapped in:
 * - StrictMode: Highlights potential problems in development
 * - BrowserRouter: Provides routing context for navigation
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode helps identify potential problems in the app
  // It renders components twice in development to detect side effects
  <React.StrictMode>
    {/* BrowserRouter provides routing capabilities using the HTML5 History API */}
    <BrowserRouter>
      {/* Main App component - contains all routes and pages */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
