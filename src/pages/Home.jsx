/**
 * Home Page Component - Home.jsx
 * 
 * This is the landing page of the iamthere application.
 * Users can:
 * - Enter their display name
 * - Create a new room (generates a 6-character code)
 * - Join an existing room by entering a room code
 * 
 * The page features a modern dark UI with gradient accents
 * and smooth animations.
 */

// Import React hooks
import React, { useState } from 'react';

// Import useNavigate for programmatic navigation
import { useNavigate, Link } from 'react-router-dom';

// Import Firebase utility functions
import { generateRoomCode, createRoom, checkRoomExists } from '../firebase';

/**
 * Home Component
 * 
 * The main landing page component where users can create or join rooms.
 * 
 * @returns {JSX.Element} The rendered home page
 */
function Home() {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  
  // User's display name (stored in localStorage for persistence)
  const [userName, setUserName] = useState(() => {
    // Try to get saved name from localStorage
    return localStorage.getItem('iamthere_userName') || '';
  });
  
  // Room code input for joining existing rooms
  const [joinRoomCode, setJoinRoomCode] = useState('');
  
  // Loading states for async operations
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  
  // Error message to display
  const [error, setError] = useState('');
  
  // Success message to display
  const [success, setSuccess] = useState('');
  
  // Navigation hook for redirecting to room
  const navigate = useNavigate();

  // =========================================================================
  // HELPER FUNCTIONS
  // =========================================================================
  
  /**
   * Validate user input before creating/joining room
   * 
   * @returns {boolean} True if input is valid
   */
  const validateUserName = () => {
    // Clear previous errors
    setError('');
    
    // Check if name is provided
    if (!userName.trim()) {
      setError('Please enter your name to continue');
      return false;
    }
    
    // Check name length
    if (userName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    
    if (userName.trim().length > 20) {
      setError('Name must be less than 20 characters');
      return false;
    }
    
    return true;
  };
  
  /**
   * Save user name to localStorage
   */
  const saveUserName = () => {
    localStorage.setItem('iamthere_userName', userName.trim());
  };

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================
  
  /**
   * Handle creating a new room
   * 
   * Generates a unique room code and creates the room in Firebase,
   * then navigates the user to the new room.
   */
  const handleCreateRoom = async () => {
    // Validate user name
    if (!validateUserName()) return;
    
    try {
      // Set loading state
      setIsCreating(true);
      setError('');
      
      // Generate a unique 6-character room code
      const roomCode = generateRoomCode();
      
      // Create the room in Firebase
      await createRoom(roomCode, userName.trim());
      
      // Save user name for future sessions
      saveUserName();
      
      // Show success message briefly
      setSuccess(`Room ${roomCode} created! Redirecting...`);
      
      // Navigate to the room after a short delay
      setTimeout(() => {
        navigate(`/room/${roomCode}`, {
          state: { userName: userName.trim(), isCreator: true }
        });
      }, 500);
      
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room. Please check your Firebase configuration.');
    } finally {
      setIsCreating(false);
    }
  };
  
  /**
   * Handle joining an existing room
   * 
   * Validates the room code, checks if the room exists in Firebase,
   * then navigates the user to the room.
   */
  const handleJoinRoom = async () => {
    // Validate user name
    if (!validateUserName()) return;
    
    // Validate room code
    if (!joinRoomCode.trim()) {
      setError('Please enter a room code');
      return;
    }
    
    // Room code should be 6 characters
    if (joinRoomCode.trim().length !== 6) {
      setError('Room code must be exactly 6 characters');
      return;
    }
    
    try {
      // Set loading state
      setIsJoining(true);
      setError('');
      
      // Convert room code to uppercase for consistency
      const roomCode = joinRoomCode.trim().toUpperCase();
      
      // Check if room exists in Firebase
      const roomExists = await checkRoomExists(roomCode);
      
      if (!roomExists) {
        setError('Room not found. Please check the code and try again.');
        return;
      }
      
      // Save user name for future sessions
      saveUserName();
      
      // Show success message
      setSuccess(`Joining room ${roomCode}...`);
      
      // Navigate to the room
      setTimeout(() => {
        navigate(`/room/${roomCode}`, {
          state: { userName: userName.trim(), isCreator: false }
        });
      }, 500);
      
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join room. Please check your Firebase configuration.');
    } finally {
      setIsJoining(false);
    }
  };
  
  /**
   * Handle Enter key press for joining room
   * 
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  
  return (
    <div className="min-h-screen bg-dark-300 flex flex-col items-center justify-center p-4">
      {/* 
        Background Gradient Decoration
        Adds visual interest with subtle gradient orbs
      */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top-left gradient orb */}
        <div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-primary-600/30 
                     rounded-full blur-3xl animate-pulse-slow"
        />
        {/* Bottom-right gradient orb */}
        <div 
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600/20 
                     rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* 
          Logo and Title Section
        */}
        <div className="text-center mb-8">
          {/* App Logo */}
          <div 
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br 
                       from-primary-500 to-pink-500 flex items-center justify-center
                       shadow-lg shadow-primary-500/30 overflow-hidden"
          >
            <img 
              src="https://raw.githubusercontent.com/developerkunalonline/test_images_for_host/refs/heads/main/Untitled_design__2_-removebg-preview.png"
              alt="iamthere Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          
          {/* App Title */}
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">iamthere</span>
          </h1>
          
          {/* App Subtitle */}
          <p className="text-gray-400">
            Be there with your loved ones, even when apart
          </p>
        </div>
        
        {/* 
          Main Card - Contains form inputs and buttons
        */}
        <div className="card p-8 animate-fade-in">
          {/* 
            Error Alert
            Displayed when there's a validation or API error
          */}
          {error && (
            <div 
              className="mb-6 p-4 bg-red-500/10 border border-red-500/50 
                         rounded-xl text-red-400 text-sm animate-slide-up"
            >
              <div className="flex items-center">
                {/* Error icon */}
                <svg 
                  className="w-5 h-5 mr-2 flex-shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* 
            Success Alert
            Displayed when an action is successful
          */}
          {success && (
            <div 
              className="mb-6 p-4 bg-green-500/10 border border-green-500/50 
                         rounded-xl text-green-400 text-sm animate-slide-up"
            >
              <div className="flex items-center">
                {/* Success icon */}
                <svg 
                  className="w-5 h-5 mr-2 flex-shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>{success}</span>
              </div>
            </div>
          )}
          
          {/* 
            Name Input Section
          */}
          <div className="mb-6">
            <label 
              htmlFor="userName" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your display name"
              className="input-field"
              maxLength={20}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-gray-500">
              This is how your partner will see you
            </p>
          </div>
          
          {/* 
            Divider with text
          */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-100 text-gray-500">
                Choose an option
              </span>
            </div>
          </div>
          
          {/* 
            Create Room Button
          */}
          <button
            onClick={handleCreateRoom}
            disabled={isCreating || isJoining}
            className="w-full btn-primary mb-4 flex items-center justify-center"
          >
            {isCreating ? (
              <>
                {/* Loading spinner */}
                <div className="loading-spinner w-5 h-5 mr-2 border-2"></div>
                Creating Room...
              </>
            ) : (
              <>
                {/* Plus icon */}
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                Create New Room
              </>
            )}
          </button>
          
          {/* 
            Join Room Section
          */}
          <div className="space-y-4">
            <div className="text-center text-gray-500 text-sm">
              — or join existing room —
            </div>
            
            {/* Room code input */}
            <input
              type="text"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter 6-digit room code"
              className="input-field text-center uppercase tracking-widest font-mono text-lg"
              maxLength={6}
              autoComplete="off"
            />
            
            {/* Join button */}
            <button
              onClick={handleJoinRoom}
              disabled={isCreating || isJoining}
              className="w-full btn-secondary flex items-center justify-center"
            >
              {isJoining ? (
                <>
                  {/* Loading spinner */}
                  <div className="loading-spinner w-5 h-5 mr-2 border-2"></div>
                  Joining Room...
                </>
              ) : (
                <>
                  {/* Arrow right icon */}
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                    />
                  </svg>
                  Join Room
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* 
          Footer Section
        */}
        <div className="mt-8 text-center text-gray-500 text-sm space-y-3">
          <p className="flex items-center justify-center space-x-1">
            <span>Developed with</span>
            <span className="text-red-500">❤️</span>
            <span>by</span>
            <Link 
              to="/developer" 
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Avni Sharma
            </Link>
          </p>
          <p>
            <Link 
              to="/developer" 
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Meet the Developer</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </p>
          <p className="text-gray-600 text-xs">
            iamthere © 2025 | Made for couples who love watching videos together
          </p>
        </div>
      </div>
    </div>
  );
}

// Export the Home component
export default Home;
