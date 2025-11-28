/**
 * VideoCall Component
 * 
 * A draggable video call overlay that shows:
 * - Local video (small, in corner)
 * - Remote video (main view)
 * - Audio/video toggle controls
 * - End call button
 * 
 * Uses WebRTC for peer-to-peer video calling with Firebase signaling.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import useWebRTC from '../hooks/useWebRTC';

/**
 * VideoCall Component
 * 
 * @param {Object} props
 * @param {string} props.roomId - Room code for signaling
 * @param {string} props.userName - Current user's display name
 * @param {boolean} props.isVisible - Whether to show the video call UI
 * @param {Function} props.onClose - Callback when call ends
 * @param {Function} props.onMicStatusChange - Callback when mic is toggled
 */
function VideoCall({ roomId, userName, isVisible, onClose, onMicStatusChange }) {
  // Generate a unique user ID for this session
  const [oderId] = useState(() => `${userName}_${Date.now()}`);
  
  // WebRTC hook
  const {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    connectionError,
    callStatus,
    isAudioEnabled,
    isVideoEnabled,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    getLocalMedia,
  } = useWebRTC(roomId, oderId, onMicStatusChange);
  
  // Video element refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // Dragging state
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  // Minimized state
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Check if HTTPS is available
  const [httpsRequired, setHttpsRequired] = useState(false);
  
  useEffect(() => {
    // Check if we're in a secure context
    const isSecure = window.isSecureContext || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
      setHttpsRequired(true);
    }
  }, []);
  
  // =========================================================================
  // VIDEO STREAM ATTACHMENT
  // =========================================================================
  
  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  
  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  
  // =========================================================================
  // AUTO-START LOCAL MEDIA
  // =========================================================================
  
  useEffect(() => {
    if (isVisible && !localStream && !httpsRequired) {
      getLocalMedia().catch(() => {
        // Error is already handled in the hook
      });
    }
  }, [isVisible, localStream, getLocalMedia, httpsRequired]);
  
  // =========================================================================
  // DRAG HANDLERS
  // =========================================================================
  
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      e.preventDefault();
    }
  }, [position]);
  
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const maxX = window.innerWidth - (isMinimized ? 80 : 320);
      const maxY = window.innerHeight - (isMinimized ? 80 : 280);
      const newX = Math.max(0, Math.min(maxX, e.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(maxY, e.clientY - dragOffset.current.y));
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, isMinimized]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Global mouse listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // =========================================================================
  // CALL HANDLERS
  // =========================================================================
  
  const handleEndCall = useCallback(() => {
    endCall();
    if (onClose) {
      onClose();
    }
  }, [endCall, onClose]);
  
  const handleToggleAudio = useCallback(() => {
    toggleAudio();
  }, [toggleAudio]);
  
  // =========================================================================
  // RENDER
  // =========================================================================
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized ? 'w-20 h-20' : 'w-80 h-[280px]'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-primary-500/50 bg-dark-200 flex flex-col">
        
        {/* Header / Drag Handle */}
        <div className="drag-handle h-8 bg-dark-100 flex items-center justify-between px-3 cursor-grab flex-shrink-0 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 
              isConnecting ? 'bg-yellow-500 animate-pulse' : 
              'bg-gray-500'
            }`} />
            <span className="text-xs text-white/80 font-medium">
              {isConnected ? 'Connected' : 
               isConnecting ? 'Connecting...' : 
               callStatus === 'calling' ? 'Calling...' :
               'Video Call'}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMinimized ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                )}
              </svg>
            </button>
            <button
              onClick={handleEndCall}
              className="p-1 rounded hover:bg-red-500/50 transition-colors"
              title="End call"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Video Area */}
        {!isMinimized && (
          <div className="flex-1 relative bg-dark-300 overflow-hidden">
            {/* Remote Video (main) */}
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center px-4">
                  {httpsRequired ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-yellow-400 text-sm font-medium mb-1">HTTPS Required</p>
                      <p className="text-gray-400 text-xs">Video calls need a secure connection (HTTPS) on mobile devices.</p>
                    </>
                  ) : connectionError ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-red-400 text-sm font-medium mb-1">Error</p>
                      <p className="text-gray-400 text-xs">{connectionError}</p>
                    </>
                  ) : !isConnected && !isConnecting ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">Start a video call</p>
                      <button
                        onClick={startCall}
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Start Call
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="loading-spinner w-8 h-8 mx-auto mb-2"></div>
                      <p className="text-gray-400 text-sm">
                        {callStatus === 'calling' ? 'Waiting for peer...' : 'Connecting...'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Local Video (picture-in-picture) */}
            {localStream && (
              <div className="absolute bottom-2 right-2 w-24 h-18 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-dark-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  </div>
                )}
              </div>
            )}
            
            {/* Error Message */}
            {connectionError && (
              <div className="absolute top-2 left-2 right-2 bg-red-500/90 text-white text-xs py-1 px-2 rounded">
                {connectionError}
              </div>
            )}
            
            {/* Mic Active Indicator */}
            {isAudioEnabled && (
              <div className="absolute top-2 left-2 right-2 bg-green-500/90 text-white text-xs py-1 px-2 rounded text-center font-medium">
                🎤 Mic ON - YouTube paused
              </div>
            )}
          </div>
        )}
        
        {/* Minimized View */}
        {isMinimized && (
          <div className="flex-1 flex items-center justify-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isConnected ? 'bg-green-500' : 'bg-primary-500'
            }`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Control Bar */}
        {!isMinimized && (
          <div className="h-14 bg-dark-100 flex items-center justify-center space-x-3 px-3 flex-shrink-0 border-t border-gray-700">
            {/* Mute Audio Button */}
            <button
              onClick={handleToggleAudio}
              className={`p-3 rounded-full transition-all ${
                isAudioEnabled 
                  ? 'bg-green-500 hover:bg-green-600 ring-2 ring-green-400/50' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={isAudioEnabled ? 'Mute (video will resume)' : 'Unmute (will pause video)'}
            >
              {isAudioEnabled ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
            
            {/* Mute Video Button */}
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-all ${
                isVideoEnabled 
                  ? 'bg-gray-600 hover:bg-gray-500' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              )}
            </button>
            
            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-all"
              title="End call"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCall;
