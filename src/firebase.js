/**
 * Firebase Configuration and Initialization
 * 
 * This file sets up the Firebase SDK for our Watch Together application.
 * We use Firebase Realtime Database for real-time synchronization of:
 * - Video playback state (play, pause, seek, video ID)
 * - Chat messages between users
 * - Room management
 * 
 * IMPORTANT: Replace the placeholder values below with your actual Firebase config.
 * You can find these values in your Firebase Console:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Select your project (or create a new one)
 * 3. Click the gear icon → Project settings
 * 4. Scroll down to "Your apps" and select the web app
 * 5. Copy the firebaseConfig object
 */

// Import Firebase core and Realtime Database modules
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, push, serverTimestamp, update, remove } from 'firebase/database';

/**
 * Firebase Configuration Object
 * 
 * REPLACE THESE VALUES with your actual Firebase project credentials.
 * 
 * To get these values:
 * 1. Create a project at https://console.firebase.google.com
 * 2. Enable Realtime Database in the Firebase Console
 * 3. Set database rules to allow read/write (for development):
 *    {
 *      "rules": {
 *        ".read": true,
 *        ".write": true
 *      }
 *    }
 * 4. Copy the config from Project Settings → Your Apps → Web App
 */
const firebaseConfig = {
  apiKey: "AIzaSyDk67T9wChw93owmNQdv9JLFGJuCxIn_Eg",
  authDomain: "watch-togather.firebaseapp.com",
  databaseURL: "https://watch-togather-default-rtdb.firebaseio.com", // REQUIRED for Realtime Database!
  projectId: "watch-togather",
  storageBucket: "watch-togather.firebasestorage.app",
  messagingSenderId: "1078870978792",
  appId: "1:1078870978792:web:4d64c6d0ba61e55365595d",
  measurementId: "G-NY4R4FM08W"
};
// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

/**
 * Generate a unique 6-character room code
 * 
 * Creates a random alphanumeric string for room identification.
 * Uses uppercase letters and numbers for easy sharing.
 * 
 * @returns {string} A 6-character room code (e.g., "ABC123")
 */
export const generateRoomCode = () => {
  // Characters to use in room code (uppercase letters and numbers)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let roomCode = '';
  
  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters[randomIndex];
  }
  
  return roomCode;
};

/**
 * Create a new room in Firebase
 * 
 * Initializes a new room with default video state.
 * The room starts with no video loaded and paused state.
 * 
 * @param {string} roomId - The unique room code
 * @param {string} creatorName - The name of the user creating the room
 * @returns {Promise<void>}
 */
export const createRoom = async (roomId, creatorName) => {
  // Get reference to the room location in database
  const roomRef = ref(database, `rooms/${roomId}`);
  
  // Set initial room data
  await set(roomRef, {
    // Video state - initially empty
    videoId: '',           // YouTube video ID (empty means no video loaded)
    isPlaying: false,      // Playback state
    currentTime: 0,        // Current playback position in seconds
    lastUpdated: Date.now(), // Timestamp of last update
    updatedBy: creatorName,  // Who made the last update
    
    // Room metadata
    createdAt: Date.now(),   // When the room was created
    createdBy: creatorName,  // Who created the room
  });
  
  console.log(`Room ${roomId} created successfully by ${creatorName}`);
};

/**
 * Check if a room exists in Firebase
 * 
 * Used when joining a room to verify the room code is valid.
 * 
 * @param {string} roomId - The room code to check
 * @returns {Promise<boolean>} True if room exists, false otherwise
 */
export const checkRoomExists = async (roomId) => {
  // Get reference to the room
  const roomRef = ref(database, `rooms/${roomId}`);
  
  // Fetch the room data
  const snapshot = await get(roomRef);
  
  // Return whether the room exists
  return snapshot.exists();
};

/**
 * Get the current room data
 * 
 * Fetches the current state of a room from Firebase.
 * 
 * @param {string} roomId - The room code
 * @returns {Promise<Object|null>} Room data or null if not found
 */
export const getRoomData = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  }
  
  return null;
};

/**
 * Update video state in Firebase
 * 
 * This function is called whenever a user interacts with the video player.
 * It updates the shared video state so other users can sync.
 * 
 * @param {string} roomId - The room code
 * @param {Object} videoState - The video state object
 * @param {string} videoState.videoId - YouTube video ID
 * @param {boolean} videoState.isPlaying - Whether video is playing
 * @param {number} videoState.currentTime - Current playback position
 * @param {string} updatedBy - Name of user making the update
 * @returns {Promise<void>}
 */
export const updateVideoState = async (roomId, videoState, updatedBy) => {
  // Get reference to room
  const roomRef = ref(database, `rooms/${roomId}`);
  
  // Update only the video-related fields
  await update(roomRef, {
    videoId: videoState.videoId,
    isPlaying: videoState.isPlaying,
    currentTime: videoState.currentTime,
    lastUpdated: Date.now(),
    updatedBy: updatedBy,
  });
  
  console.log(`Video state updated by ${updatedBy}:`, videoState);
};

/**
 * Subscribe to room updates
 * 
 * Sets up a real-time listener for room state changes.
 * The callback is invoked whenever any room data changes.
 * 
 * @param {string} roomId - The room code
 * @param {Function} callback - Function to call with updated room data
 * @returns {Function} Unsubscribe function to stop listening
 */
export const subscribeToRoom = (roomId, callback) => {
  // Get reference to room
  const roomRef = ref(database, `rooms/${roomId}`);
  
  // Set up real-time listener
  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback(data);
    }
  }, (error) => {
    console.error('Error subscribing to room:', error);
  });
  
  // Return the unsubscribe function
  return unsubscribe;
};

/**
 * Send a chat message
 * 
 * Adds a new message to the room's messages collection.
 * Messages are stored with server timestamp for ordering.
 * 
 * @param {string} roomId - The room code
 * @param {string} sender - Name of the message sender
 * @param {string} text - The message content
 * @returns {Promise<void>}
 */
export const sendMessage = async (roomId, sender, text) => {
  // Get reference to messages collection for this room
  const messagesRef = ref(database, `rooms/${roomId}/messages`);
  
  // Push a new message with unique key
  await push(messagesRef, {
    sender: sender,
    text: text,
    timestamp: Date.now(),
  });
  
  console.log(`Message sent by ${sender}: ${text}`);
};

/**
 * Subscribe to chat messages
 * 
 * Sets up a real-time listener for new chat messages.
 * The callback receives an array of all messages whenever messages change.
 * 
 * @param {string} roomId - The room code
 * @param {Function} callback - Function to call with messages array
 * @returns {Function} Unsubscribe function to stop listening
 */
export const subscribeToMessages = (roomId, callback) => {
  // Get reference to messages collection
  const messagesRef = ref(database, `rooms/${roomId}/messages`);
  
  // Set up real-time listener
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const messages = [];
    
    if (snapshot.exists()) {
      // Convert the object to an array and sort by timestamp
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      
      // Sort messages by timestamp (oldest first)
      messages.sort((a, b) => a.timestamp - b.timestamp);
    }
    
    callback(messages);
  }, (error) => {
    console.error('Error subscribing to messages:', error);
  });
  
  return unsubscribe;
};

/**
 * Delete a room from Firebase
 * 
 * Removes all room data including messages.
 * Use with caution - this is irreversible.
 * 
 * @param {string} roomId - The room code to delete
 * @returns {Promise<void>}
 */
export const deleteRoom = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`);
  await remove(roomRef);
  console.log(`Room ${roomId} deleted`);
};

// =========================================================================
// WEBRTC SIGNALING FUNCTIONS
// =========================================================================

/**
 * Send WebRTC signaling data (offer, answer, or ICE candidate)
 * 
 * @param {string} roomId - The room code
 * @param {string} oderId - The user ID
 * @param {string} type - Type of signal: 'offer', 'answer', or 'ice-candidate'
 * @param {Object} data - The signaling data
 */
export const sendSignal = async (roomId, oderId, type, data) => {
  const signalRef = ref(database, `rooms/${roomId}/webrtc/${oderId}/${type}`);
  await set(signalRef, {
    data: JSON.stringify(data),
    timestamp: Date.now(),
  });
  console.log(`[WebRTC] Sent ${type} signal`);
};

/**
 * Subscribe to WebRTC signaling data from a specific user
 * 
 * @param {string} roomId - The room code
 * @param {string} oderId - The remote user's ID to listen for
 * @param {string} type - Type of signal to listen for
 * @param {Function} callback - Callback with the signal data
 * @returns {Function} Unsubscribe function
 */
export const subscribeToSignal = (roomId, oderId, type, callback) => {
  const signalRef = ref(database, `rooms/${roomId}/webrtc/${oderId}/${type}`);
  
  const unsubscribe = onValue(signalRef, (snapshot) => {
    if (snapshot.exists()) {
      const { data, timestamp } = snapshot.val();
      callback(JSON.parse(data), timestamp);
    }
  });
  
  return unsubscribe;
};

/**
 * Subscribe to all ICE candidates from a remote peer
 * 
 * @param {string} roomId - The room code
 * @param {string} oderId - The remote user's ID
 * @param {Function} callback - Callback for each ICE candidate
 * @returns {Function} Unsubscribe function
 */
export const subscribeToIceCandidates = (roomId, oderId, callback) => {
  const iceRef = ref(database, `rooms/${roomId}/webrtc/${oderId}/ice-candidates`);
  
  const unsubscribe = onValue(iceRef, (snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();
        if (data) {
          callback(JSON.parse(data));
        }
      });
    }
  });
  
  return unsubscribe;
};

/**
 * Add an ICE candidate to Firebase
 * 
 * @param {string} roomId - The room code
 * @param {string} oderId - The user's ID
 * @param {Object} candidate - The ICE candidate
 */
export const addIceCandidate = async (roomId, oderId, candidate) => {
  const iceRef = ref(database, `rooms/${roomId}/webrtc/${oderId}/ice-candidates`);
  await push(iceRef, JSON.stringify(candidate));
};

/**
 * Clear WebRTC signaling data for a user
 * 
 * @param {string} roomId - The room code
 * @param {string} oderId - The user's ID
 */
export const clearSignaling = async (roomId, oderId) => {
  const signalingRef = ref(database, `rooms/${roomId}/webrtc/${oderId}`);
  await remove(signalingRef);
  console.log(`[WebRTC] Cleared signaling for ${oderId}`);
};

/**
 * Set user's call status (available, calling, in-call)
 * 
 * @param {string} roomId - The room code
 * @param {string} oderId - The user's ID
 * @param {string} status - The call status
 */
export const setCallStatus = async (roomId, oderId, status) => {
  const statusRef = ref(database, `rooms/${roomId}/webrtc/${oderId}/status`);
  await set(statusRef, {
    status,
    timestamp: Date.now(),
  });
};

/**
 * Subscribe to a user's call status
 * 
 * @param {string} roomId - The room code
 * @param {string} oderId - The user ID to watch
 * @param {Function} callback - Callback with status
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCallStatus = (roomId, oderId, callback) => {
  const statusRef = ref(database, `rooms/${roomId}/webrtc/${oderId}/status`);
  
  const unsubscribe = onValue(statusRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });
  
  return unsubscribe;
};

// Export the database instance for advanced usage
export { database, ref, onValue, update };

// Default export of the Firebase app
export default app;
