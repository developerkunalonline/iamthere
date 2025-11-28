/**
 * RoomHeader Component
 * 
 * Displays the room header with:
 * - Room code display
 * - Copy to clipboard button
 * - Leave room button
 * - Connection status indicator
 * 
 * Features:
 * - Copy room code with visual feedback
 * - Responsive design
 * - Connection status indicator
 */

// Import React hooks
import React, { useState } from 'react';

// Import useNavigate for navigation
import { useNavigate } from 'react-router-dom';

/**
 * RoomHeader Component
 * 
 * The header bar displayed at the top of the room page.
 * 
 * @param {Object} props - Component props
 * @param {string} props.roomCode - The 6-character room code
 * @param {boolean} props.isConnected - Whether connected to Firebase
 * @param {string} props.userName - Current user's name
 * @returns {JSX.Element} The rendered header
 */
function RoomHeader({ roomCode, isConnected, userName }) {
  // =========================================================================
  // STATE
  // =========================================================================
  
  // Track if code was recently copied
  const [copied, setCopied] = useState(false);
  
  // Navigation hook
  const navigate = useNavigate();

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================
  
  /**
   * Handle Copy Room Code
   * 
   * Copies the room code to the clipboard and shows visual feedback.
   */
  const handleCopyCode = async () => {
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(roomCode);
      
      // Show success feedback
      setCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      console.log('Room code copied to clipboard:', roomCode);
    } catch (err) {
      console.error('Failed to copy room code:', err);
      
      // Fallback: create a temporary input and copy
      const tempInput = document.createElement('input');
      tempInput.value = roomCode;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  /**
   * Handle Leave Room
   * 
   * Navigates back to the home page.
   */
  const handleLeaveRoom = () => {
    // Confirm before leaving
    const confirmed = window.confirm('Are you sure you want to leave this room?');
    
    if (confirmed) {
      navigate('/');
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  
  return (
    <header className="bg-dark-100 border-b border-gray-800 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* 
          Left Section - Logo and Title
        */}
        <div className="flex items-center space-x-4">
          {/* Logo/Icon */}
          <div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 
                       flex items-center justify-center shadow-lg shadow-primary-500/20"
          >
            <svg 
              className="w-5 h-5 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          
          {/* Title (hidden on mobile) */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white">Watch Together</h1>
            <p className="text-xs text-gray-500">Watching as {userName}</p>
          </div>
        </div>
        
        {/* 
          Center Section - Room Code
        */}
        <div className="flex items-center space-x-3">
          {/* Connection Status Indicator */}
          <div className="flex items-center space-x-2">
            <div 
              className={`w-2 h-2 rounded-full ${
                isConnected 
                  ? 'bg-green-500 animate-pulse' 
                  : 'bg-yellow-500'
              }`}
            />
            <span className="text-xs text-gray-500 hidden sm:inline">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          
          {/* Room Code Display */}
          <div 
            className="flex items-center space-x-2 px-4 py-2 bg-dark-200 
                       rounded-xl border border-gray-700"
          >
            <span className="text-xs text-gray-500 hidden sm:inline">Room:</span>
            <span className="room-code text-lg text-primary-400 font-bold tracking-wider">
              {roomCode}
            </span>
          </div>
          
          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            className={`p-2 rounded-xl transition-all duration-200 ${
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-dark-200 text-gray-400 hover:text-white border border-gray-700 hover:border-primary-500'
            }`}
            title="Copy room code"
          >
            {copied ? (
              // Checkmark icon when copied
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              // Copy icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* 
          Right Section - Leave Button
        */}
        <div>
          <button
            onClick={handleLeaveRoom}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-200 
                       rounded-xl border border-gray-700 text-gray-400 
                       hover:text-red-400 hover:border-red-500/50 
                       transition-all duration-200"
          >
            {/* Exit icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">Leave</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// Export the component
export default RoomHeader;
