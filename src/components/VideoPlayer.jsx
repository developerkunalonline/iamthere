/**
 * VideoPlayer Component
 * 
 * This component integrates the YouTube IFrame Player API with React.
 * It handles:
 * - Loading the YouTube IFrame API script
 * - Creating and managing the player instance
 * - Capturing player events (play, pause, state changes)
 * - Forwarding events to the sync hook
 * 
 * The component uses refs to maintain player state without
 * causing unnecessary re-renders.
 */

// Import React hooks
import React, { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';

/**
 * YouTube Player States (from YouTube IFrame API)
 * 
 * -1: Unstarted
 *  0: Ended
 *  1: Playing
 *  2: Paused
 *  3: Buffering
 *  5: Video cued
 */
const PLAYER_STATES = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

/**
 * VideoPlayer Component
 * 
 * A React wrapper for the YouTube IFrame Player API.
 * Uses forwardRef to expose the player instance to parent components.
 * 
 * @param {Object} props - Component props
 * @param {string} props.videoId - The YouTube video ID to play
 * @param {Function} props.onPlay - Callback when video starts playing
 * @param {Function} props.onPause - Callback when video is paused
 * @param {Function} props.onSeek - Callback when video is seeked
 * @param {Function} props.onReady - Callback when player is ready
 * @param {Function} props.isRemoteUpdateInProgress - Function to check if sync is in progress
 * @param {Object} ref - Forwarded ref for player instance
 */
const VideoPlayer = forwardRef(({
  videoId,
  onPlay,
  onPause,
  onSeek,
  onReady,
  isRemoteUpdateInProgress,
}, ref) => {
  // =========================================================================
  // STATE AND REFS
  // =========================================================================
  
  // Reference to the container div for the YouTube player
  const containerRef = useRef(null);
  
  // Reference to the YouTube player instance
  const playerRef = useRef(null);
  
  // Track if API is loaded
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  
  // Track if player is ready
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  // Track last reported time to detect seeks
  const lastReportedTime = useRef(0);
  
  // Track if we're currently seeking (to avoid multiple seek events)
  const isSeeking = useRef(false);
  
  // Unique player ID to avoid conflicts
  const playerId = useRef(`youtube-player-${Date.now()}`);
  
  // =========================================================================
  // EXPOSE PLAYER METHODS VIA REF
  // =========================================================================
  
  /**
   * Expose player methods to parent component
   * 
   * This allows the parent (Room component) to control the player
   * and access player state for synchronization.
   */
  useImperativeHandle(ref, () => ({
    // Get the current playback time
    getCurrentTime: () => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        return playerRef.current.getCurrentTime();
      }
      return 0;
    },
    
    // Get the current player state
    getPlayerState: () => {
      if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
        return playerRef.current.getPlayerState();
      }
      return -1;
    },
    
    // Get video data (includes video_id)
    getVideoData: () => {
      if (playerRef.current && typeof playerRef.current.getVideoData === 'function') {
        return playerRef.current.getVideoData();
      }
      return {};
    },
    
    // Play the video
    playVideo: () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }
    },
    
    // Pause the video
    pauseVideo: () => {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
    },
    
    // Seek to a specific time
    seekTo: (seconds, allowSeekAhead) => {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(seconds, allowSeekAhead);
      }
    },
    
    // Load a video by ID
    loadVideoById: (videoId, startSeconds = 0) => {
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(videoId, startSeconds);
      }
    },
    
    // Get the raw player instance
    getPlayer: () => playerRef.current,
  }), []);

  // =========================================================================
  // LOAD YOUTUBE IFRAME API
  // =========================================================================
  
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      console.log('[VideoPlayer] YouTube API already loaded');
      setIsApiLoaded(true);
      return;
    }
    
    // Check if script is already being loaded
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      console.log('[VideoPlayer] YouTube API script already exists, waiting...');
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          setIsApiLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }
    
    console.log('[VideoPlayer] Loading YouTube IFrame API');
    
    // Create the callback function that YouTube API will call
    window.onYouTubeIframeAPIReady = () => {
      console.log('[VideoPlayer] YouTube IFrame API Ready');
      setIsApiLoaded(true);
    };
    
    // Create and append the script tag
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      // Note: We don't remove the script as other components might need it
    };
  }, []);

  // =========================================================================
  // CREATE YOUTUBE PLAYER
  // =========================================================================
  
  useEffect(() => {
    // Wait for API to load and container to be available
    if (!isApiLoaded || !containerRef.current) return;
    
    // Don't create player if already exists
    if (playerRef.current) return;
    
    console.log('[VideoPlayer] Creating YouTube player');
    
    // Create the player instance
    playerRef.current = new window.YT.Player(playerId.current, {
      // Player dimensions (responsive via CSS)
      height: '100%',
      width: '100%',
      
      // Initial video ID
      videoId: videoId || undefined,
      
      // Player configuration
      playerVars: {
        // Enable JS API
        enablejsapi: 1,
        // Auto-play when loaded
        autoplay: 0,
        // Disable related videos from other channels
        rel: 0,
        // Show modest branding
        modestbranding: 1,
        // Enable controls
        controls: 1,
        // Allow fullscreen
        fs: 1,
        // HTML5 player
        html5: 1,
        // Origin for security
        origin: window.location.origin,
        // Disable keyboard controls (we handle our own)
        disablekb: 0,
        // Show video info
        showinfo: 0,
        // Color scheme
        color: 'white',
      },
      
      // Event handlers
      events: {
        onReady: handlePlayerReady,
        onStateChange: handleStateChange,
        onError: handleError,
      },
    });
  }, [isApiLoaded, videoId]);

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================
  
  /**
   * Handle Player Ready Event
   * 
   * Called when the YouTube player is fully loaded and ready.
   */
  const handlePlayerReady = useCallback((event) => {
    console.log('[VideoPlayer] Player ready');
    setIsPlayerReady(true);
    
    // Call parent callback
    if (onReady) {
      onReady(event.target);
    }
  }, [onReady]);
  
  /**
   * Handle Player State Change Event
   * 
   * Called when the player state changes (play, pause, end, etc.)
   * This is where we detect user interactions and sync them.
   */
  const handleStateChange = useCallback((event) => {
    const state = event.data;
    console.log('[VideoPlayer] State change:', state);
    
    // Check if this is a remote update (from sync)
    // If so, ignore to prevent loops
    if (isRemoteUpdateInProgress && isRemoteUpdateInProgress()) {
      console.log('[VideoPlayer] Ignoring state change during remote update');
      return;
    }
    
    // Get current time
    const currentTime = event.target.getCurrentTime();
    
    switch (state) {
      case PLAYER_STATES.PLAYING:
        console.log('[VideoPlayer] Playing at:', currentTime);
        
        // Check if this is a seek (large time jump)
        const timeDiff = Math.abs(currentTime - lastReportedTime.current);
        if (timeDiff > 2 && !isSeeking.current) {
          // This is a seek followed by play
          console.log('[VideoPlayer] Detected seek during play');
          if (onSeek) {
            onSeek(currentTime, true);
          }
        } else if (onPlay) {
          onPlay(currentTime);
        }
        
        lastReportedTime.current = currentTime;
        isSeeking.current = false;
        break;
        
      case PLAYER_STATES.PAUSED:
        console.log('[VideoPlayer] Paused at:', currentTime);
        
        // Check if this is a seek (user scrubbed the timeline)
        const pauseTimeDiff = Math.abs(currentTime - lastReportedTime.current);
        if (pauseTimeDiff > 2) {
          // This is a seek
          console.log('[VideoPlayer] Detected seek during pause');
          isSeeking.current = true;
          if (onSeek) {
            onSeek(currentTime, false);
          }
        } else if (onPause) {
          onPause(currentTime);
        }
        
        lastReportedTime.current = currentTime;
        break;
        
      case PLAYER_STATES.BUFFERING:
        console.log('[VideoPlayer] Buffering');
        // Check for seek during buffering
        const bufferTimeDiff = Math.abs(currentTime - lastReportedTime.current);
        if (bufferTimeDiff > 2) {
          isSeeking.current = true;
        }
        break;
        
      case PLAYER_STATES.ENDED:
        console.log('[VideoPlayer] Video ended');
        // Optionally handle video end
        break;
        
      default:
        break;
    }
  }, [onPlay, onPause, onSeek, isRemoteUpdateInProgress]);
  
  /**
   * Handle Player Error Event
   * 
   * Called when the player encounters an error.
   */
  const handleError = useCallback((event) => {
    const errorCode = event.data;
    let errorMessage = 'Unknown error';
    
    switch (errorCode) {
      case 2:
        errorMessage = 'Invalid video ID';
        break;
      case 5:
        errorMessage = 'HTML5 player error';
        break;
      case 100:
        errorMessage = 'Video not found';
        break;
      case 101:
      case 150:
        errorMessage = 'Video cannot be embedded';
        break;
      default:
        errorMessage = `Error code: ${errorCode}`;
    }
    
    console.error('[VideoPlayer] Error:', errorMessage);
  }, []);

  // =========================================================================
  // CLEANUP
  // =========================================================================
  
  useEffect(() => {
    // Cleanup player on unmount
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        console.log('[VideoPlayer] Destroying player');
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  // =========================================================================
  // RENDER
  // =========================================================================
  
  return (
    <div className="video-player-wrapper w-full h-full">
      {/* Player Container with 16:9 aspect ratio */}
      <div 
        ref={containerRef}
        className="video-container bg-dark-300 rounded-xl overflow-hidden shadow-2xl"
      >
        {/* 
          YouTube Player Target Element
          The YouTube API will replace this div with an iframe
        */}
        <div id={playerId.current} className="w-full h-full" />
        
        {/* 
          Loading Overlay
          Shown while player is loading
        */}
        {!isPlayerReady && (
          <div 
            className="absolute inset-0 flex items-center justify-center 
                       bg-dark-300/80 backdrop-blur-sm"
          >
            <div className="text-center">
              {/* Loading spinner */}
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-400">Loading player...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Set display name for debugging
VideoPlayer.displayName = 'VideoPlayer';

// Export the component
export default VideoPlayer;
