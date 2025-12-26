/**
 * Room Page Component - Room.jsx
 * 
 * The main watch party room where users can:
 * - Watch YouTube videos together in sync
 * - Chat in real-time
 * - Load new videos
 * - See sync status
 * 
 * This page integrates:
 * - VideoPlayer component for YouTube playback
 * - ChatBox component for messaging
 * - RoomHeader component for room info
 * - useRoomSync hook for Firebase synchronization
 * 
 * Layout:
 * - Desktop: Video on left (70%), Chat on right (30%)
 * - Mobile: Video on top, Chat below
 */

// Import React hooks
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import routing hooks
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

// Import custom sync hook
import useRoomSync from '../hooks/useRoomSync';

// Import components
import VideoPlayer from '../components/VideoPlayer';
import ChatBox from '../components/ChatBox';
import RoomHeader from '../components/RoomHeader';
import VideoCall from '../components/VideoCall';

// Import Firebase functions for initial room check
import { checkRoomExists } from '../firebase';

/**
 * Extract YouTube Video ID from URL
 * 
 * Parses various YouTube URL formats to extract the video ID.
 * Supports:
 * - Standard watch URLs: youtube.com/watch?v=VIDEO_ID
 * - Short URLs: youtu.be/VIDEO_ID
 * - Embed URLs: youtube.com/embed/VIDEO_ID
 * - Direct video IDs
 * 
 * @param {string} input - YouTube URL or video ID
 * @returns {string|null} The video ID or null if invalid
 */
const extractVideoId = (input) => {
  // If empty, return null
  if (!input || !input.trim()) return null;
  
  const trimmedInput = input.trim();
  
  // Check if it's already just a video ID (11 characters, alphanumeric + _ -)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmedInput)) {
    return trimmedInput;
  }
  
  try {
    // Try to parse as URL
    const url = new URL(trimmedInput);
    
    // Handle youtube.com URLs
    if (url.hostname.includes('youtube.com')) {
      // Standard watch URL
      if (url.pathname === '/watch') {
        return url.searchParams.get('v');
      }
      // Embed URL
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/embed/')[1]?.split('?')[0];
      }
      // Shorts URL
      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/shorts/')[1]?.split('?')[0];
      }
    }
    
    // Handle youtu.be URLs
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1).split('?')[0];
    }
  } catch (e) {
    // Not a valid URL, check if it could be a video ID with extra characters
    const match = trimmedInput.match(/[a-zA-Z0-9_-]{11}/);
    if (match) {
      return match[0];
    }
  }
  
  return null;
};

/**
 * Room Page Component
 * 
 * The main watch party experience.
 * 
 * @returns {JSX.Element} The rendered room page
 */
function Room() {
  // =========================================================================
  // ROUTING AND NAVIGATION
  // =========================================================================
  
  // Get room ID from URL params
  const { roomId } = useParams();
  
  // Get navigation state (userName, isCreator)
  const location = useLocation();
  
  // Navigation hook for redirects
  const navigate = useNavigate();
  
  // =========================================================================
  // USER STATE
  // =========================================================================
  
  // Get user name from location state or localStorage
  const [userName, setUserName] = useState(() => {
    // First try location state
    if (location.state?.userName) {
      return location.state.userName;
    }
    // Fall back to localStorage
    return localStorage.getItem('iamthere_userName') || 'Guest';
  });
  
  // =========================================================================
  // LOCAL STATE
  // =========================================================================
  
  // Video URL input field
  const [videoUrlInput, setVideoUrlInput] = useState('');
  
  // Loading state for video URL submission
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  
  // Error state for video URL
  const [videoError, setVideoError] = useState('');
  
  // Room verification state
  const [isVerifying, setIsVerifying] = useState(true);
  const [roomNotFound, setRoomNotFound] = useState(false);
  
  // Jitsi video call state
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  
  // =========================================================================
  // REFS
  // =========================================================================
  
  // Reference to the VideoPlayer component
  const playerRef = useRef(null);

  // =========================================================================
  // SYNC HOOK
  // =========================================================================
  
  // Initialize the room sync hook
  const {
    roomState,
    messages,
    isLoading,
    isConnected,
    error,
    sendPlay,
    sendPause,
    sendSeek,
    loadVideo,
    sendChatMessage,
    isRemoteUpdateInProgress,
  } = useRoomSync(roomId, userName, playerRef);

  // =========================================================================
  // ROOM VERIFICATION
  // =========================================================================
  
  /**
   * Verify Room Exists
   * 
   * Checks if the room exists when the page loads.
   * Redirects to home if room is not found.
   */
  useEffect(() => {
    const verifyRoom = async () => {
      try {
        const exists = await checkRoomExists(roomId);
        
        if (!exists) {
          setRoomNotFound(true);
        }
      } catch (err) {
        console.error('Error verifying room:', err);
        setRoomNotFound(true);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyRoom();
  }, [roomId]);

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================
  
  /**
   * Handle Mic Status Change from Jitsi
   * 
   * When a user unmutes their mic in Jitsi, the video should pause
   * for BOTH users. This allows them to talk without missing content.
   * 
   * @param {boolean} isMicOn - True if mic is ON (unmuted)
   */
  const handleMicStatusChange = useCallback((isMicOn) => {
    console.log('[Room] Mic status changed:', isMicOn ? 'ON' : 'OFF');
    
    if (isMicOn) {
      // Mic is ON - pause the video for both users
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime?.() || 0;
        console.log('[Room] Pausing video because mic is ON');
        
        // Pause locally
        playerRef.current.pauseVideo();
        
        // Send pause to Firebase so other user also pauses
        sendPause(currentTime);
      }
    }
    // When mic is turned OFF, user can manually resume the video
  }, [sendPause]);
  
  /**
   * Handle Video Player Ready
   * 
   * Called when the YouTube player is ready.
   * Loads the current video if one is set in room state.
   */
  const handlePlayerReady = useCallback((player) => {
    console.log('[Room] Player ready');
    
    // If there's already a video in the room, load it
    if (roomState.videoId && playerRef.current) {
      console.log('[Room] Loading existing video:', roomState.videoId);
      playerRef.current.loadVideoById(roomState.videoId, roomState.currentTime);
      
      // Handle initial play state
      if (!roomState.isPlaying) {
        setTimeout(() => {
          playerRef.current?.pauseVideo();
        }, 500);
      }
    }
  }, [roomState.videoId, roomState.currentTime, roomState.isPlaying]);
  
 
  const handlePlay = useCallback((currentTime) => {
    console.log('[Room] Video play at:', currentTime);
    sendPlay(currentTime);
  }, [sendPlay]);
  
  /**
   * Handle Video Pause
   * 
   * Called when the video is paused.
   * Sends the pause event to Firebase for sync.
   */
  const handlePause = useCallback((currentTime) => {
    console.log('[Room] Video pause at:', currentTime);
    sendPause(currentTime);
  }, [sendPause]);
  
  /**
   * Handle Video Seek
   * 
   * Called when the user seeks to a new position.
   * Sends the seek event to Firebase for sync.
   */
  const handleSeek = useCallback((currentTime, isPlaying) => {
    console.log('[Room] Video seek to:', currentTime, 'playing:', isPlaying);
    sendSeek(currentTime, isPlaying);
  }, [sendSeek]);
  
  /**
   * Handle Load New Video
   * 
   * Processes the video URL input and loads the new video.
   */
  const handleLoadVideo = async () => {
    // Clear previous error
    setVideoError('');
    
    // Extract video ID from input
    const videoId = extractVideoId(videoUrlInput);
    
    if (!videoId) {
      setVideoError('Invalid YouTube URL or video ID');
      return;
    }
    
    try {
      setIsLoadingVideo(true);
      
      // Load the video via sync hook
      loadVideo(videoId);
      
      // Clear the input
      setVideoUrlInput('');
      
      console.log('[Room] Loading new video:', videoId);
    } catch (err) {
      console.error('[Room] Error loading video:', err);
      setVideoError('Failed to load video');
    } finally {
      setIsLoadingVideo(false);
    }
  };
  
  /**
   * Handle Enter Key in Video Input
   * 
   * Loads the video when Enter is pressed.
   */
  const handleVideoInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLoadVideo();
    }
  };

  // =========================================================================
  // RENDER - LOADING STATE
  // =========================================================================
  
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Connecting to room...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER - ROOM NOT FOUND
  // =========================================================================
  
  if (roomNotFound) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md text-center">
          {/* Error icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Room Not Found</h2>
          <p className="text-gray-400 mb-6">
            The room code "{roomId}" doesn't exist or has expired.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER - MAIN ROOM
  // =========================================================================
  
  return (
    <div className="min-h-screen bg-dark-300 flex flex-col">
      {/* 
        Room Header
        Contains room code, copy button, connection status, leave button
      */}
      <RoomHeader 
        roomCode={roomId} 
        isConnected={isConnected}
        userName={userName}
      />
      
      {/* 
        Main Content Area
        Responsive layout: side-by-side on desktop, stacked on mobile
      */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 
          Video Section
          Contains the video player and video URL input
        */}
        <div className="w-full lg:w-[70%] p-4 flex flex-col">
          {/* 
            Video URL Input
            Allows users to load new videos
          */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                onKeyPress={handleVideoInputKeyPress}
                placeholder="Paste YouTube URL or video ID..."
                className="input-field flex-1"
              />
              <button
                onClick={handleLoadVideo}
                disabled={isLoadingVideo || !videoUrlInput.trim()}
                className="btn-primary whitespace-nowrap"
              >
                {isLoadingVideo ? (
                  <span className="flex items-center">
                    <div className="loading-spinner w-4 h-4 mr-2 border-2"></div>
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Load Video
                  </span>
                )}
              </button>
            </div>
            
            {/* Video Error Message */}
            {videoError && (
              <p className="text-red-400 text-sm mt-2">{videoError}</p>
            )}
            
            {/* Helpful hint */}
            <p className="text-gray-600 text-xs mt-2">
              Paste a YouTube URL or video ID to start watching together
            </p>
          </div>
          
          {/* 
            Video Player Container
            Responsive aspect ratio container
          */}
          <div className="flex-1 flex items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
            {roomState.videoId ? (
              <div className="w-full h-full max-w-6xl mx-auto">
                <VideoPlayer
                  ref={playerRef}
                  videoId={roomState.videoId}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onSeek={handleSeek}
                  onReady={handlePlayerReady}
                  isRemoteUpdateInProgress={isRemoteUpdateInProgress}
                />
              </div>
            ) : (
              // Empty State - No video loaded
              <div className="w-full h-full max-w-6xl mx-auto">
                <div className="video-container bg-dark-200 rounded-xl flex items-center justify-center">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    {/* YouTube icon */}
                    <div className="w-20 h-20 mb-4 rounded-full bg-dark-100 flex items-center justify-center">
                      <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Video Loaded
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      Paste a YouTube URL above to start watching together.
                      Both you and your partner will see the same video in sync!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 
            Sync Status Bar
            Shows current video state and last update info
          */}
          {roomState.videoId && (
            <div className="mt-4 flex items-center justify-between p-3 bg-dark-200 rounded-xl border border-gray-800 text-sm">
              {/* Playback Status */}
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${roomState.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-400">
                  {roomState.isPlaying ? 'Playing' : 'Paused'}
                </span>
              </div>
              
              {/* Last Updated Info */}
              <div className="text-gray-500 text-xs">
                {roomState.updatedBy && (
                  <span>Last action by: {roomState.updatedBy === userName ? 'You' : roomState.updatedBy}</span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* 
          Chat Section
          Right side on desktop, bottom on mobile
        */}
        <div className="w-full lg:w-[30%] p-4 lg:pl-0 flex flex-col h-[400px] lg:h-auto lg:max-h-[calc(100vh-80px)] lg:min-h-0">
          <ChatBox
            messages={messages}
            userName={userName}
            onSendMessage={sendChatMessage}
          />
        </div>
      </main>
      
      {/* 
        Video Call Toggle Button
        Fixed position button to start/stop video call
      */}
      <button
        onClick={() => setIsVideoCallActive(!isVideoCallActive)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isVideoCallActive 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
        title={isVideoCallActive ? 'End video call' : 'Start video call'}
      >
        {isVideoCallActive ? (
          // Video off icon
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
          </svg>
        ) : (
          // Video on icon
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      
      {/* 
        WebRTC Video Call Component
        Small draggable video overlay for peer-to-peer video chat
        Uses Firebase for signaling, no external services needed
        When mic is unmuted, it triggers video pause for both users
      */}
      <VideoCall
        roomId={roomId}
        userName={userName}
        isVisible={isVideoCallActive}
        onClose={() => setIsVideoCallActive(false)}
        onMicStatusChange={handleMicStatusChange}
      />
      
      {/* 
        Error Toast
        Shown when there's a sync error
      */}
      {error && (
        <div className="toast toast-error animate-slide-up">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* 
        Footer with Developer Credit
      */}
      <footer className="bg-dark-100 border-t border-gray-800 px-4 py-3 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p className="flex items-center space-x-1">
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
          <p className="mt-2 sm:mt-0">
            <Link 
              to="/developer" 
              className="hover:text-purple-400 transition-colors"
            >
              iamthere © 2025
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Export the component
export default Room;
