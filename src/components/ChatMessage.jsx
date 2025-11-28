/**
 * ChatMessage Component
 * 
 * Renders a single chat message with styling based on whether
 * it's from the current user or their partner.
 * 
 * Features:
 * - Different bubble styles for own vs partner messages
 * - Timestamp display
 * - Smooth fade-in animation
 */

// Import React
import React from 'react';

/**
 * Format timestamp to readable time
 * 
 * Converts a Unix timestamp to a formatted time string.
 * 
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time string (e.g., "2:30 PM")
 */
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * ChatMessage Component
 * 
 * Displays a single chat message with appropriate styling.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.message - The message object
 * @param {string} props.message.id - Unique message ID
 * @param {string} props.message.sender - Name of the sender
 * @param {string} props.message.text - Message content
 * @param {number} props.message.timestamp - When the message was sent
 * @param {boolean} props.isOwn - Whether this message is from the current user
 * @returns {JSX.Element} The rendered message
 */
function ChatMessage({ message, isOwn }) {
  return (
    <div 
      className={`flex flex-col mb-3 animate-slide-up ${
        isOwn ? 'items-end' : 'items-start'
      }`}
    >
      {/* 
        Sender Name (only shown for partner messages)
        Own messages don't need the name since the user knows it's them
      */}
      {!isOwn && (
        <span className="text-xs text-gray-500 mb-1 ml-2">
          {message.sender}
        </span>
      )}
      
      {/* 
        Message Bubble
        Different styles for own vs partner messages
      */}
      <div 
        className={isOwn ? 'chat-bubble-own' : 'chat-bubble-partner'}
      >
        {/* Message Text */}
        <p className="text-sm leading-relaxed">
          {message.text}
        </p>
      </div>
      
      {/* 
        Timestamp
        Shows when the message was sent
      */}
      <span 
        className={`text-xs text-gray-600 mt-1 ${
          isOwn ? 'mr-2' : 'ml-2'
        }`}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}

// Export the component
export default ChatMessage;
