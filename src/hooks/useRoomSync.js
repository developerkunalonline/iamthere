/**
 * useRoomSync Custom Hook
 * 
 * This hook handles all the real-time synchronization logic between
 * Firebase Realtime Database and the YouTube player.
 * 
 * Key Features:
 * - Subscribes to room state changes in Firebase
 * - Provides functions to update video state (play, pause, seek, load)
 * - Prevents infinite update loops with isRemoteUpdate flag
 * - Handles chat message synchronization
 * 
 * The hook uses a combination of:
 * - useState for local state management
 * - useEffect for Firebase subscriptions
 * - useRef for mutable values that don't trigger re-renders
 * - useCallback for memoized event handlers
 */

// Import React hooks
import { useState, useEffect, useRef, useCallback } from 'react';

// Import Firebase functions
import { 
  subscribeToRoom, 
  updateVideoState, 
  subscribeToMessages, 
  sendMessage 
} from '../firebase';

/**
 * useRoomSync Hook
 * 
 * Manages real-time synchronization for a watch party room.
 * 
 * @param {string} roomId - The unique room identifier
 * @param {string} userName - The current user's display name
 * @param {Object|null} playerRef - Reference to the YouTube player instance
 * @returns {Object} Room state and control functions
 */
function useRoomSync(roomId, userName, playerRef) {
  // =========================================================================
  // STATE DECLARATIONS
  // =========================================================================
  
  /**
   * Room State
   * Contains all the synced room data from Firebase
   */
  const [roomState, setRoomState] = useState({
    videoId: '',           // Current YouTube video ID
    isPlaying: false,      // Whether the video is playing
    currentTime: 0,        // Current playback position in seconds
    lastUpdated: 0,        // Timestamp of last update
    updatedBy: '',         // Name of user who made the last update
  });
  
  /**
   * Chat Messages
   * Array of all messages in the room
   */
  const [messages, setMessages] = useState([]);
  
  /**
   * Loading State
   * True while initially loading room data
   */
  const [isLoading, setIsLoading] = useState(true);
  
  /**
   * Connection State
   * Indicates if we're connected to Firebase
   */
  const [isConnected, setIsConnected] = useState(false);
  
  /**
   * Error State
   * Stores any error messages
   */
  const [error, setError] = useState(null);

  // =========================================================================
  // REFS FOR MUTABLE STATE
  // =========================================================================
  
  /**
   * Remote Update Flag
   * 
   * CRITICAL: This ref is used to prevent infinite update loops.
   * When we receive an update from Firebase and update the player,
   * the player fires state change events. We need to ignore these
   * events so we don't send the same state back to Firebase.
   * 
   * Flow:
   * 1. Receive Firebase update
   * 2. Set isRemoteUpdate.current = true
   * 3. Update player (triggers player events)
   * 4. Player events check this flag and skip Firebase update
   * 5. Set isRemoteUpdate.current = false after a short delay
   */
  const isRemoteUpdate = useRef(false);
  
  /**
   * Last Processed Update Timestamp
   * 
   * Used to avoid processing the same update multiple times
   * and to handle out-of-order updates.
   */
  const lastProcessedUpdate = useRef(0);
  
  /**
   * Current Video ID Ref
   * 
   * Tracks the current video ID to detect changes when loading new videos.
   */
  const currentVideoIdRef = useRef('');
  
  /**
   * Seek Threshold
   * 
   * Minimum difference in seconds to trigger a seek operation.
   * Small differences are ignored to prevent constant seeking
   * due to slight timing variations.
   */
  const SEEK_THRESHOLD = 2; // seconds

  // =========================================================================
  // FIREBASE SUBSCRIPTIONS
  // =========================================================================
  
  /**
   * Subscribe to Room State Changes
   * 
   * Sets up a real-time listener for room data in Firebase.
   * Updates local state when room data changes.
   */
  useEffect(() => {
    // Early return if no roomId
    if (!roomId) return;
    
    console.log(`[useRoomSync] Subscribing to room: ${roomId}`);
    
    // Subscribe to room updates
    const unsubscribeRoom = subscribeToRoom(roomId, (data) => {
      console.log('[useRoomSync] Room data received:', data);
      
      // Mark as connected
      setIsConnected(true);
      setIsLoading(false);
      setError(null);
      
      // Initialize currentVideoIdRef on first load if empty
      if (!currentVideoIdRef.current && data.videoId) {
        console.log('[useRoomSync] Initializing video ID ref:', data.videoId);
        currentVideoIdRef.current = data.videoId;
      }
      
      // Check if this is a new update we haven't processed
      if (data.lastUpdated <= lastProcessedUpdate.current) {
        console.log('[useRoomSync] Skipping old update');
        return;
      }
      
      // Check if the update was made by us
      const isOwnUpdate = data.updatedBy === userName;
      
      if (isOwnUpdate) {
        console.log('[useRoomSync] Processing our own update, current ref:', currentVideoIdRef.current, 'new:', data.videoId);
        
        // Check if video ID changed - we need to load it on our player too
        if (data.videoId && data.videoId !== currentVideoIdRef.current && playerRef?.current) {
          console.log('[useRoomSync] Loading new video on our device:', data.videoId);
          currentVideoIdRef.current = data.videoId;
          playerRef.current.loadVideoById(data.videoId, data.currentTime || 0);
          
          if (!data.isPlaying) {
            setTimeout(() => {
              playerRef.current?.pauseVideo();
            }, 500);
          }
        }
        
        // Update the state
        setRoomState((prev) => ({
          ...prev,
          ...data,
        }));
        lastProcessedUpdate.current = data.lastUpdated;
        return;
      }
      
      // This is a remote update - process it
      console.log('[useRoomSync] Processing remote update from:', data.updatedBy, 'current ref:', currentVideoIdRef.current, 'new:', data.videoId);
      
      // Set the remote update flag to prevent loops
      isRemoteUpdate.current = true;
      
      // Update local state
      setRoomState((prev) => {
        const newState = {
          ...prev,
          ...data,
        };
        return newState;
      });
      
      // Update the player if it exists
      if (playerRef && playerRef.current) {
        const player = playerRef.current;
        
        try {
          // Handle video ID change (load new video)
          if (data.videoId && data.videoId !== currentVideoIdRef.current) {
            console.log('[useRoomSync] Loading new video:', data.videoId);
            currentVideoIdRef.current = data.videoId;
            player.loadVideoById(data.videoId, data.currentTime || 0);
            
            // If the video should be paused, pause after a delay
            if (!data.isPlaying) {
              setTimeout(() => {
                player.pauseVideo();
              }, 500);
            }
          } else {
            // Handle seek - check if time difference is significant
            const playerTime = player.getCurrentTime?.() || 0;
            const timeDiff = Math.abs(playerTime - data.currentTime);
            
            if (timeDiff > SEEK_THRESHOLD) {
              console.log('[useRoomSync] Seeking to:', data.currentTime);
              player.seekTo(data.currentTime, true);
            }
            
            // Handle play/pause state
            const playerState = player.getPlayerState?.();
            const isPlayerPlaying = playerState === 1; // 1 = playing in YouTube API
            
            if (data.isPlaying && !isPlayerPlaying) {
              console.log('[useRoomSync] Playing video');
              player.playVideo();
            } else if (!data.isPlaying && isPlayerPlaying) {
              console.log('[useRoomSync] Pausing video');
              player.pauseVideo();
            }
          }
        } catch (err) {
          console.error('[useRoomSync] Error updating player:', err);
        }
      }
      
      // Update last processed timestamp
      lastProcessedUpdate.current = data.lastUpdated;
      
      // Reset the remote update flag after a short delay
      // This delay ensures player events are fired and ignored
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 1000);
    });
    
    // Cleanup subscription on unmount
    return () => {
      console.log('[useRoomSync] Unsubscribing from room');
      unsubscribeRoom();
      // Reset refs on cleanup
      currentVideoIdRef.current = '';
      lastProcessedUpdate.current = 0;
    };
  }, [roomId, userName, playerRef]);
  
  /**
   * Subscribe to Chat Messages
   * 
   * Sets up a real-time listener for chat messages in Firebase.
   */
  useEffect(() => {
    // Early return if no roomId
    if (!roomId) return;
    
    console.log(`[useRoomSync] Subscribing to messages: ${roomId}`);
    
    // Subscribe to message updates
    const unsubscribeMessages = subscribeToMessages(roomId, (newMessages) => {
      console.log('[useRoomSync] Messages received:', newMessages.length);
      setMessages(newMessages);
    });
    
    // Cleanup subscription on unmount
    return () => {
      console.log('[useRoomSync] Unsubscribing from messages');
      unsubscribeMessages();
    };
  }, [roomId]);

  // =========================================================================
  // OUTGOING UPDATE FUNCTIONS
  // =========================================================================
  
  /**
   * Update Video State in Firebase
   * 
   * Called when the user interacts with the video player.
   * Sends the current state to Firebase for other users to sync.
   * 
   * @param {Object} newState - The new video state
   * @param {string} newState.videoId - YouTube video ID
   * @param {boolean} newState.isPlaying - Whether video is playing
   * @param {number} newState.currentTime - Current playback position
   */
  const updateState = useCallback(async (newState) => {
    // Check if this is a remote update (ignore to prevent loops)
    if (isRemoteUpdate.current) {
      console.log('[useRoomSync] Ignoring update during remote sync');
      return;
    }
    
    // Validate roomId and userName
    if (!roomId || !userName) {
      console.error('[useRoomSync] Cannot update: missing roomId or userName');
      return;
    }
    
    console.log('[useRoomSync] Sending update to Firebase:', newState);
    
    try {
      // Merge new state with existing state
      const updatedState = {
        videoId: newState.videoId ?? roomState.videoId,
        isPlaying: newState.isPlaying ?? roomState.isPlaying,
        currentTime: newState.currentTime ?? roomState.currentTime,
      };
      
      // Update Firebase
      await updateVideoState(roomId, updatedState, userName);
      
      // Update local state immediately for responsiveness
      setRoomState((prev) => ({
        ...prev,
        ...updatedState,
        lastUpdated: Date.now(),
        updatedBy: userName,
      }));
      
    } catch (err) {
      console.error('[useRoomSync] Error updating state:', err);
      setError('Failed to sync video state');
    }
  }, [roomId, userName, roomState]);
  
  /**
   * Send Play Event
   * 
   * Called when the user presses play on the video.
   * 
   * @param {number} currentTime - Current playback position when play was pressed
   */
  const sendPlay = useCallback((currentTime) => {
    console.log('[useRoomSync] sendPlay:', currentTime);
    updateState({
      isPlaying: true,
      currentTime: currentTime,
    });
  }, [updateState]);
  
  /**
   * Send Pause Event
   * 
   * Called when the user pauses the video.
   * 
   * @param {number} currentTime - Current playback position when pause was pressed
   */
  const sendPause = useCallback((currentTime) => {
    console.log('[useRoomSync] sendPause:', currentTime);
    updateState({
      isPlaying: false,
      currentTime: currentTime,
    });
  }, [updateState]);
  
  /**
   * Send Seek Event
   * 
   * Called when the user seeks to a new position.
   * 
   * @param {number} currentTime - New playback position after seek
   * @param {boolean} isPlaying - Whether the video should be playing
   */
  const sendSeek = useCallback((currentTime, isPlaying) => {
    console.log('[useRoomSync] sendSeek:', currentTime, isPlaying);
    updateState({
      currentTime: currentTime,
      isPlaying: isPlaying,
    });
  }, [updateState]);
  
  /**
   * Load New Video
   * 
   * Called when the user loads a new YouTube video.
   * Resets playback to the beginning.
   * 
   * @param {string} videoId - The YouTube video ID to load
   */
  const loadVideo = useCallback((videoId) => {
    console.log('[useRoomSync] loadVideo called with:', videoId, 'current ref:', currentVideoIdRef.current);
    
    // Update the ref immediately so we know this is the new video
    // The Firebase callback will then load it on the player
    updateState({
      videoId: videoId,
      currentTime: 0,
      isPlaying: true, // Auto-play when loading new video
    });
  }, [updateState]);
  
  /**
   * Send Chat Message
   * 
   * Sends a new message to the room's chat.
   * 
   * @param {string} text - The message text
   */
  const sendChatMessage = useCallback(async (text) => {
    if (!text.trim() || !roomId || !userName) return;
    
    console.log('[useRoomSync] Sending message:', text);
    
    try {
      await sendMessage(roomId, userName, text.trim());
    } catch (err) {
      console.error('[useRoomSync] Error sending message:', err);
      setError('Failed to send message');
    }
  }, [roomId, userName]);
  
  /**
   * Check if Remote Update is in Progress
   * 
   * Used by the VideoPlayer component to check if it should
   * ignore player state changes.
   * 
   * @returns {boolean} True if a remote update is being processed
   */
  const isRemoteUpdateInProgress = useCallback(() => {
    return isRemoteUpdate.current;
  }, []);

  // =========================================================================
  // RETURN HOOK VALUES
  // =========================================================================
  
  return {
    // State
    roomState,           // Current room state (videoId, isPlaying, currentTime, etc.)
    messages,            // Array of chat messages
    isLoading,           // Loading state
    isConnected,         // Connection state
    error,               // Error message if any
    
    // Outgoing update functions
    sendPlay,            // Send play event
    sendPause,           // Send pause event
    sendSeek,            // Send seek event
    loadVideo,           // Load new video
    sendChatMessage,     // Send chat message
    
    // Utility functions
    isRemoteUpdateInProgress, // Check if remote update is in progress
  };
}

// Export the hook
export default useRoomSync;
