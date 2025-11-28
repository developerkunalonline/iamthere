/**
 * ChatBox Component
 * 
 * The main chat interface component that includes:
 * - Message list display with auto-scroll
 * - Message input field
 * - Send button
 * - Empty state
 * 
 * Features:
 * - Real-time message updates
 * - Auto-scroll to newest messages
 * - Enter key to send
 * - Distinguishes between own and partner messages
 */

// Import React hooks
import React, { useState, useRef, useEffect } from 'react';

// Import ChatMessage component
import ChatMessage from './ChatMessage';

/**
 * ChatBox Component
 * 
 * A complete chat interface for the watch party room.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {string} props.userName - Current user's name
 * @param {Function} props.onSendMessage - Callback to send a new message
 * @returns {JSX.Element} The rendered chat box
 */
function ChatBox({ messages, userName, onSendMessage }) {
  // =========================================================================
  // STATE
  // =========================================================================
  
  // Input field value
  const [inputValue, setInputValue] = useState('');
  
  // Ref to the messages container for auto-scroll
  const messagesEndRef = useRef(null);
  
  // Ref to the messages container for scroll behavior
  const messagesContainerRef = useRef(null);

  // =========================================================================
  // AUTO-SCROLL EFFECT
  // =========================================================================
  
  /**
   * Auto-scroll to Bottom
   * 
   * Scrolls the message list to the bottom whenever new messages arrive.
   * Uses smooth scrolling for better UX.
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages]);

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================
  
  /**
   * Handle Input Change
   * 
   * Updates the input value state as the user types.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  /**
   * Handle Send Message
   * 
   * Sends the message if input is not empty, then clears the input.
   */
  const handleSendMessage = () => {
    // Validate input
    if (!inputValue.trim()) return;
    
    // Call the send callback
    onSendMessage(inputValue.trim());
    
    // Clear the input
    setInputValue('');
  };
  
  /**
   * Handle Key Press
   * 
   * Sends the message when Enter key is pressed.
   * 
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  
  return (
    <div className="flex flex-col h-full bg-dark-200 rounded-2xl border border-gray-800 overflow-hidden">
      {/* 
        Chat Header
      */}
      <div className="px-4 py-3 bg-dark-100 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Chat icon */}
            <svg 
              className="w-5 h-5 text-primary-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <h3 className="font-semibold text-white">Chat</h3>
          </div>
          
          {/* Message count badge */}
          <span className="text-xs text-gray-500">
            {messages.length} messages
          </span>
        </div>
      </div>
      
      {/* 
        Messages Container
        Scrollable area containing all messages
      */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin"
      >
        {/* 
          Empty State
          Shown when there are no messages yet
        */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {/* Empty chat illustration */}
            <div 
              className="w-16 h-16 rounded-full bg-dark-100 flex items-center 
                         justify-center mb-4"
            >
              <svg 
                className="w-8 h-8 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-600 text-xs mt-1">
              Say hello to your watch partner! 👋
            </p>
          </div>
        ) : (
          /* 
            Message List
            Renders all messages with appropriate styling
          */
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.sender === userName}
              />
            ))}
            
            {/* 
              Scroll Target
              Invisible element at the bottom for auto-scroll
            */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* 
        Message Input Area
        Contains the input field and send button
      */}
      <div className="p-4 bg-dark-100 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          {/* 
            Text Input
          */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-dark-200 border border-gray-700 rounded-xl 
                       text-white placeholder-gray-500 text-sm
                       focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 
                       transition-all duration-200"
            maxLength={500}
          />
          
          {/* 
            Send Button
          */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`p-2 rounded-xl transition-all duration-200 ${
              inputValue.trim()
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/30'
                : 'bg-dark-200 text-gray-600 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            {/* Send icon */}
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </div>
        
        {/* 
          Character Count
          Shows how many characters are remaining
        */}
        {inputValue.length > 400 && (
          <p className="text-xs text-gray-500 mt-1 text-right">
            {500 - inputValue.length} characters remaining
          </p>
        )}
      </div>
    </div>
  );
}

// Export the component
export default ChatBox;
