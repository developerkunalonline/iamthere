/**
 * App Component - Main Application Router
 * 
 * This is the root component of our Watch Together application.
 * It sets up the routing structure and provides global context.
 * 
 * Routes:
 * - "/" : Home page (create/join room)
 * - "/room/:roomId" : Room page (video player + chat)
 */

// Import React
import React from 'react';

// Import React Router for navigation
import { Routes, Route } from 'react-router-dom';

// Import page components
import Home from './pages/Home';
import Room from './pages/Room';

/**
 * App Component
 * 
 * The main application component that defines routes
 * and provides the overall structure of the app.
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  return (
    // Main app container with dark background
    <div className="min-h-screen bg-dark-300 text-white">
      {/* 
        Routes Container
        Defines all the pages/routes in our application
      */}
      <Routes>
        {/* 
          Home Route
          The landing page where users can create or join a room
        */}
        <Route path="/" element={<Home />} />
        
        {/* 
          Room Route
          Dynamic route that accepts a roomId parameter
          This is where the video player and chat are displayed
        */}
        <Route path="/room/:roomId" element={<Room />} />
        
        {/* 
          Catch-all Route (404)
          Redirects unknown routes to home page
        */}
        <Route 
          path="*" 
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              {/* 404 Error Message */}
              <h1 className="text-4xl font-bold text-primary-400 mb-4">
                404 - Page Not Found
              </h1>
              <p className="text-gray-400 mb-8">
                The page you're looking for doesn't exist.
              </p>
              {/* Link back to home */}
              <a 
                href="/" 
                className="btn-primary"
              >
                Go Home
              </a>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

// Export the App component as default
export default App;
