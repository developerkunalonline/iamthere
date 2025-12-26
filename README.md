# 💜 iamthere - Be There Together

> **"Be there with your loved ones, even when apart"**

**iamthere** is a real-time YouTube watch party application with integrated peer-to-peer video calling. Watch YouTube videos together in **perfect synchronization** while seeing and talking to each other through WebRTC video calls. Built with React, Firebase Realtime Database, YouTube IFrame Player API, and WebRTC.

![iamthere Banner](https://raw.githubusercontent.com/developerkunalonline/test_images_for_host/refs/heads/main/Untitled_design__2_-removebg-preview.png)

---

## 👩‍💻 Meet the Developer

<div align="center">
  <img src="https://raw.githubusercontent.com/developerkunalonline/test_images_for_host/refs/heads/main/WhatsApp%20Image%202025-12-27%20at%203.03.06%20AM.jpeg" alt="Avni Sharma" width="150" height="150" style="border-radius: 50%; border: 3px solid #8b5cf6;" />
  
  ### **Avni Sharma**
  *Building communities, analyzing data, and creating impact through technology*
  
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/avni-sharma)
  [![Email](https://img.shields.io/badge/Email-Contact-purple?style=for-the-badge&logo=gmail)](mailto:avnivandil1@gmail.com)
  
  **[📄 View Full Developer Profile →](/developer)**
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technical Deep Dive](#-technical-deep-dive)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Data Flow](#-data-flow)
- [Key Components](#-key-components)
- [Custom Hooks](#-custom-hooks)
- [State Management](#-state-management)
- [Sync Mechanisms](#-sync-mechanisms)
- [WebRTC Implementation](#-webrtc-implementation)
- [Firebase Integration](#-firebase-integration)
- [Deployment](#-deployment)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Overview

**iamthere** solves the problem of watching videos together when physically apart. It provides:

1. **Synchronized Video Playback** - All actions (play, pause, seek, load new video) are instantly synced between participants
2. **Peer-to-Peer Video Calling** - See and hear your partner using WebRTC without any third-party video services
3. **Real-time Chat** - Communicate via text while watching
4. **Zero Configuration** - Just share a room code and start watching

### Use Cases
- Long-distance couples watching movies together
- Friends watching music videos or tutorials
- Family members sharing video content across distances
- Watch parties for events, premieres, or shows

---

## ✨ Features

### 🎥 Core Features

#### Real-time Video Synchronization
- **Play/Pause Sync** - When one user plays or pauses, the other's video responds instantly
- **Seek Sync** - Jump to any timestamp and your partner's video follows (±2 second threshold to prevent jitter)
- **Video Load Sync** - Load a new video and it appears on both screens simultaneously
- **Buffering Handling** - Intelligent handling of network delays and buffering states
- **Sub-second Accuracy** - Synchronization maintained within 2 seconds for seamless experience

#### Video Calling
- **Peer-to-Peer Connection** - Direct WebRTC connection between users (no intermediary servers)
- **Audio & Video** - Full duplex audio and video streaming (640x480 default resolution)
- **Mic Control** - Mute/unmute microphone with visual indicators
- **Auto-pause Integration** - YouTube video automatically pauses when you unmute your mic (configurable)
- **Connection Status** - Visual indicators for connection state (connecting, connected, disconnected)

#### Live Chat
- **Real-time Messaging** - Messages delivered instantly via Firebase
- **Auto-scroll** - Chat automatically scrolls to the latest message
- **Timestamp Display** - Each message shows when it was sent
- **Username Display** - Clear identification of who sent each message
- **Persistent History** - Chat history retained for the room session

#### Room System
- **6-Character Codes** - Short, easy-to-share room identifiers (e.g., ABC123)
- **Create or Join** - Host creates a room, partner joins with the code
- **Participant List** - See who's in the room
- **Room Persistence** - Rooms persist until manually closed or timed out
- **Single-click Copy** - Copy room code to clipboard with one click

### 🎨 User Experience

- **Dark Theme** - Modern, eye-friendly dark UI with purple accents
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Minimal Setup** - Just enter your name and create/join a room
- **No Sign-up Required** - Start watching immediately without creating an account
- **LocalStorage Persistence** - Username saved locally for convenience

### 🔧 Technical Features

- **Serverless Architecture** - No backend server needed, uses Firebase
- **Real-time Updates** - Firebase Realtime Database for instant synchronization
- **Loop Prevention** - Sophisticated mechanisms to prevent infinite sync loops
- **State Closure Handling** - Functional setState to avoid stale state issues
- **Video ID Tracking** - Ref-based tracking to detect video changes accurately
- **Error Recovery** - Graceful handling of network issues and disconnections
- **STUN Server Integration** - Uses Google's public STUN servers for NAT traversal

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER LAYER                              │
│  ┌────────────────┐              ┌────────────────┐         │
│  │   User A       │◄────P2P─────►│   User B       │         │
│  │   Browser      │  Video/Audio │   Browser      │         │
│  └────────┬───────┘              └───────┬────────┘         │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   REACT APPLICATION                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Video    │  │ Video    │  │  Chat    │  │  Room    │   │
│  │ Player   │  │  Call    │  │  Box     │  │ Header   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│  ┌────┴─────────────┴──────────────┴─────────────┴──────┐  │
│  │         Custom Hooks (Business Logic)                │  │
│  │  ┌─────────────────┐      ┌──────────────────┐      │  │
│  │  │  useRoomSync    │      │   useWebRTC      │      │  │
│  │  │  - Video Sync   │      │   - P2P Call     │      │  │
│  │  │  - Chat Sync    │      │   - Signaling    │      │  │
│  │  │  - Loop Guard   │      │   - ICE Exchange │      │  │
│  │  └────────┬────────┘      └────────┬─────────┘      │  │
│  └───────────┼──────────────────────────┼───────────────┘  │
└──────────────┼──────────────────────────┼──────────────────┘
               │                          │
               ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│              FIREBASE REALTIME DATABASE                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   rooms/     │  │  messages/   │  │  signaling/  │     │
│  │   {roomId}   │  │   {roomId}   │  │   {roomId}   │     │
│  │              │  │              │  │              │     │
│  │ • videoId    │  │ • text       │  │ • offer      │     │
│  │ • isPlaying  │  │ • userName   │  │ • answer     │     │
│  │ • currentTime│  │ • timestamp  │  │ • candidates │     │
│  │ • updatedBy  │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
               ▲                          ▲
               │                          │
               └──────Real-time Sync──────┘

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌─────────────────────┐        ┌──────────────────────┐   │
│  │  YouTube IFrame API │        │  WebRTC + STUN       │   │
│  │  - Video Playback   │        │  - Google STUN 1&2   │   │
│  │  - State Events     │        │  - ICE Framework     │   │
│  └─────────────────────┘        └──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18.2.0 | UI component library with hooks |
| **Build Tool** | Vite 5.4.17 | Fast dev server and optimized builds |
| **Styling** | TailwindCSS 3.4.17 | Utility-first CSS framework |
| **Routing** | React Router 6.28.0 | Client-side routing |
| **Database** | Firebase Realtime DB | Real-time data synchronization |
| **Video Player** | YouTube IFrame API | Embedded YouTube player |
| **Video Call** | WebRTC (Native) | Peer-to-peer audio/video |
| **Signaling** | Firebase Realtime DB | WebRTC offer/answer exchange |
| **STUN Servers** | Google STUN | NAT traversal for WebRTC |

---

## � Technical Deep Dive

### System Components Overview

The application consists of several interconnected layers, each responsible for specific functionality:

#### 1. Presentation Layer (React Components)
- **Home.jsx** - Landing page for room creation/joining
- **Room.jsx** - Main container orchestrating all room features
- **VideoPlayer.jsx** - YouTube player wrapper with event handling
- **VideoCall.jsx** - WebRTC video call interface
- **ChatBox.jsx** - Real-time chat UI
- **RoomHeader.jsx** - Room information display

#### 2. Business Logic Layer (Custom Hooks)
- **useRoomSync** - Manages Firebase synchronization for video state and chat
- **useWebRTC** - Handles peer-to-peer WebRTC connections

#### 3. Data Layer
- **Firebase Realtime Database** - Central data store for all real-time state
- **LocalStorage** - Client-side username persistence

#### 4. External Services
- **YouTube IFrame API** - Video playback engine
- **WebRTC Infrastructure** - P2P communication framework
- **Google STUN Servers** - NAT traversal assistance

---


## 📁 Project Structure

```
iamthere/
├── public/
│   └── vite.svg                 # App favicon
│
├── src/
│   ├── components/              # React UI Components
│   │   ├── ChatBox.jsx          # Chat interface with message list and input
│   │   ├── ChatMessage.jsx      # Individual chat message display
│   │   ├── RoomHeader.jsx       # Room code, participants, and controls
│   │   ├── VideoCall.jsx        # WebRTC video call overlay with mic toggle
│   │   └── VideoPlayer.jsx      # YouTube IFrame Player wrapper
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useRoomSync.js       # Firebase sync for video state & chat
│   │   └── useWebRTC.js         # WebRTC peer connection management
│   │
│   ├── pages/                   # Route Components
│   │   ├── Home.jsx             # Landing page (create/join room)
│   │   └── Room.jsx             # Main watch party room container
│   │
│   ├── App.jsx                  # Main app component with routing
│   ├── firebase.js              # Firebase config and helper functions
│   ├── index.css                # Global styles and Tailwind directives
│   └── main.jsx                 # React entry point
│
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration for Tailwind
├── tailwind.config.js           # Tailwind CSS theme customization
├── vite.config.js               # Vite build configuration
└── README.md                    # This comprehensive documentation
```

### File Responsibilities

#### Components

**`VideoPlayer.jsx`**
- Loads YouTube IFrame API dynamically
- Creates and manages YouTube player instance
- Exposes imperative methods via forwardRef:
  - `playVideo()`, `pauseVideo()`, `seekTo()`, `loadVideoById()`
- Emits events to parent: `onPlay`, `onPause`, `onSeek`, `onReady`
- Handles player state changes (-1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued)
- Prevents event loops by checking `isRemoteUpdateInProgress()`

**`VideoCall.jsx`**
- Renders local and remote video streams from WebRTC
- Provides microphone mute/unmute toggle
- Integrates with YouTube player for auto-pause when mic unmuted
- Displays connection status (connecting, connected, disconnected, failed)
- Uses CSS object-fit to maintain aspect ratios

**`ChatBox.jsx`**
- Displays scrollable message list with flexbox layout
- Message input field with send button
- Auto-scrolls to latest message using `scrollIntoView()`
- Shows timestamps in human-readable format
- Handles Enter key for sending messages
- Fixed header and input, scrollable middle section

**`RoomHeader.jsx`**
- Displays room code with gradient styling
- Lists participant names
- Copy-to-clipboard button for room code
- Responsive layout for mobile and desktop

**`Home.jsx`**
- Username input with localStorage persistence
- Room creation with 6-character code generation
- Room joining with code validation
- Navigation to Room page on successful creation/join
- Error display for invalid room codes

**`Room.jsx`**
- Container component orchestrating all room features
- Manages YouTube URL input and video loading
- Integrates VideoPlayer, VideoCall, and ChatBox
- Handles player ready state and initial video load
- Responsive grid layout adapting to screen size

#### Custom Hooks

**`useRoomSync.js`** (374 lines)
- **Purpose**: Manages all Firebase Realtime Database interactions
- **Key Functions**:
  - `loadVideo(videoId)` - Loads a new video and syncs to Firebase
  - `sendPlay(currentTime)` - Broadcasts play event
  - `sendPause(currentTime)` - Broadcasts pause event
  - `sendSeek(newTime)` - Broadcasts seek event
  - `sendChatMessage(text)` - Sends chat message to Firebase
  - `updateState(newState)` - Core function to update Firebase with new state
- **State Management**:
  - `roomState` - Current room video state (videoId, isPlaying, currentTime)
  - `messages` - Chat message array
  - `isLoading` - Initial loading state
  - `isConnected` - Firebase connection status
  - `error` - Error message state
- **Refs for Loop Prevention**:
  - `isRemoteUpdate` - Flag to prevent sending updates while processing remote changes
  - `lastProcessedUpdate` - Timestamp of last processed update to avoid duplicates
  - `currentVideoIdRef` - Tracks current video ID to detect changes
- **Critical Logic**:
  - Uses functional `setState(prev => {...})` to avoid stale state closure issues
  - Skips old updates by comparing timestamps
  - Differentiates own updates vs. remote updates to handle appropriately
  - Resets `isRemoteUpdate` flag after 1-second delay

**`useWebRTC.js`** (469 lines)
- **Purpose**: Manages WebRTC peer-to-peer connections
- **Key Functions**:
  - `initializeWebRTC()` - Sets up peer connection and gets local media
  - `createOffer()` - Creates SDP offer for peer
  - `handleOffer()` - Processes received offer and creates answer
  - `handleAnswer()` - Processes received answer
  - `addIceCandidate()` - Adds ICE candidates for NAT traversal
- **State Management**:
  - `localStream` - User's camera/mic MediaStream
  - `remoteStream` - Partner's MediaStream
  - `isMuted` - Microphone mute state
  - `connectionState` - WebRTC connection status
- **WebRTC Flow**:
  1. Get local media stream (`getUserMedia`)
  2. Create `RTCPeerConnection` with STUN servers
  3. Add local stream tracks to connection
  4. Set up event handlers (track, icecandidate, connectionstatechange)
  5. Create and exchange offer/answer via Firebase signaling
  6. Exchange ICE candidates for NAT traversal
  7. Connection established → remote stream available
- **Signaling via Firebase**:
  - Offers stored at `signaling/{roomId}/{peerId}/offer`
  - Answers stored at `signaling/{roomId}/{peerId}/answer`
  - ICE candidates stored at `signaling/{roomId}/{peerId}/candidates`

#### Configuration Files

**`firebase.js`**
- Firebase SDK initialization
- Database reference creation
- Helper functions:
  - `createRoom(userName)` - Creates new room in database
  - `joinRoom(roomId, userName)` - Adds user to existing room
  - `updateVideoState(roomId, state, userName)` - Updates video state
  - `subscribeToRoom(roomId, callback)` - Real-time room subscription
  - `sendMessage(roomId, userName, text)` - Sends chat message
  - `subscribeToMessages(roomId, callback)` - Real-time message subscription
  - `saveSignalingData(roomId, peerId, type, data)` - Saves WebRTC signaling
  - `subscribeToSignaling(roomId, peerId, callback)` - WebRTC signal subscription

**`tailwind.config.js`**
- Custom color scheme with purple (`#8b5cf6`) as primary
- Dark theme configuration
- Custom utilities for gradients and effects

**`vite.config.js`**
- React plugin configuration
- Development server settings
- Build optimization

---


## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A **Firebase account** - [Sign up](https://firebase.google.com/)
- Modern web browser (Chrome, Firefox, Edge, or Safari)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd whatch-matcher

# Install dependencies
npm install
```

### Dependencies Overview

```json
{
  "dependencies": {
    "react": "^18.2.0",              // UI framework
    "react-dom": "^18.2.0",          // React DOM rendering
    "react-router-dom": "^6.28.0",   // Client-side routing
    "firebase": "^11.1.0"            // Firebase SDK for Realtime Database
  },
  "devDependencies": {
    "vite": "^5.4.17",               // Build tool and dev server
    "tailwindcss": "^3.4.17",        // CSS framework
    "autoprefixer": "^10.4.20",      // CSS vendor prefixing
    "postcss": "^8.4.49"             // CSS processing
  }
}
```

### Step 2: Set Up Firebase

#### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name (e.g., `iamthere-app`)
4. (Optional) Enable Google Analytics
5. Click **"Create Project"**

#### 2.2 Enable Realtime Database

1. In Firebase Console, navigate to **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Choose your database location (select closest to your users)
4. Start in **"Test Mode"** for development:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   
> ⚠️ **Important**: Test mode allows unrestricted access. Update rules for production!

#### 2.3 Production Database Rules (Recommended)

For production deployment, use these more secure rules:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['videoId', 'isPlaying', 'currentTime', 'lastUpdated', 'updatedBy'])",
        "videoId": {
          ".validate": "newData.isString() && newData.val().length === 11"
        },
        "isPlaying": {
          ".validate": "newData.isBoolean()"
        },
        "currentTime": {
          ".validate": "newData.isNumber()"
        },
        "lastUpdated": {
          ".validate": "newData.isNumber()"
        },
        "updatedBy": {
          ".validate": "newData.isString()"
        },
        "participants": {
          ".validate": "newData.hasChildren()"
        }
      }
    },
    "messages": {
      "$roomId": {
        "$messageId": {
          ".read": true,
          ".write": true,
          ".validate": "newData.hasChildren(['text', 'userName', 'timestamp'])"
        }
      }
    },
    "signaling": {
      "$roomId": {
        "$peerId": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
```

#### 2.4 Get Firebase Configuration

1. In Firebase Console, click the **Settings** gear icon → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., `iamthere-web`)
5. Copy the `firebaseConfig` object

Example config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

> 📝 **Critical**: The `databaseURL` field is REQUIRED for Realtime Database!

#### 2.5 Update Firebase Config in Code

Open `src/firebase.js` and replace the placeholder config:

```javascript
// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, off } from 'firebase/database';

// Replace with YOUR Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",  // REQUIRED!
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ... rest of the code
```

### Step 3: Run Development Server

```bash
# Start the Vite development server
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

Open this URL in your browser. You should see the iamthere landing page!

### Step 4: Test the Application

1. **Open two browser windows** (or use regular + incognito mode)
2. **Window 1**:
   - Enter your name (e.g., "Alice")
   - Click "Create New Room"
   - Copy the 6-character room code
3. **Window 2**:
   - Enter a different name (e.g., "Bob")
   - Paste the room code in "Join Room" field
   - Click "Join Room"
4. **In either window**:
   - Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
   - Click "Load Video"
5. **Test synchronization**:
   - Play/pause in one window → other window should sync
   - Seek to different timestamp → other window should follow
   - Load new video → both windows should update

### Step 5: Enable Video Calling (Optional)

Video calling requires microphone and camera permissions:

1. Browser will ask for permissions when joining a room
2. Click **"Allow"** for both microphone and camera
3. You should see your own video feed (local stream)
4. When partner joins, you'll see their video feed (remote stream)
5. Click the microphone icon to mute/unmute

> 🔒 **HTTPS Requirement**: WebRTC requires HTTPS in production. Use ngrok or deploy to hosting with HTTPS (Vercel, Netlify, Firebase Hosting).

---

## 🎮 How to Use

### Creating a Room

1. Open the app in your browser
2. Enter your display name
3. Click **"Create New Room"**
4. Share the 6-character room code with your partner

### Joining a Room

1. Open the app in your browser
2. Enter your display name
3. Enter the room code shared by your partner
4. Click **"Join Room"**

### Watching Together

1. **Load a Video**:
   - Paste a YouTube URL in the input field
   - Supported formats:
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
     - `https://www.youtube.com/embed/VIDEO_ID`
     - `https://www.youtube.com/shorts/VIDEO_ID`
     - Just the 11-character video ID
   - Click **"Load Video"**

2. **Control Playback**:
   - Click play/pause on the YouTube player
   - Seek to any position using the progress bar
   - Actions sync automatically to your partner's screen

3. **Video Calling**:
   - Allow microphone and camera permissions when prompted
   - Your video appears in the call window
   - Partner's video appears when they join
   - Click mic icon to mute/unmute
   - YouTube auto-pauses when you unmute (configurable in code)

4. **Chat**:
   - Type messages in the chat input
   - Press Enter or click Send
   - Messages appear in real-time for both users

---

## 🔄 How It Works

### Application Flow

```
START
  │
  ├─> User Opens App (Home Page)
  │     │
  │     ├─> Enter Name → Stored in localStorage
  │     │
  │     ├─> CREATE ROOM
  │     │     │
  │     │     ├─> Generate 6-char code
  │     │     ├─> Create Firebase room entry
  │     │     ├─> Initialize empty room state
  │     │     └─> Navigate to /room/{roomId}
  │     │
  │     └─> JOIN ROOM
  │           │
  │           ├─> Validate room code format
  │           ├─> Check if room exists in Firebase
  │           ├─> Add user to participants list
  │           └─> Navigate to /room/{roomId}
  │
  ├─> Room Page Loads
  │     │
  │     ├─> useRoomSync Hook Initializes
  │     │     │
  │     │     ├─> Subscribe to Firebase rooms/{roomId}
  │     │     ├─> Subscribe to Firebase messages/{roomId}
  │     │     ├─> Load existing video if present
  │     │     └─> Set up state listeners
  │     │
  │     ├─> useWebRTC Hook Initializes
  │     │     │
  │     │     ├─> Request camera/mic permissions
  │     │     ├─> Get local media stream
  │     │     ├─> Create RTCPeerConnection
  │     │     ├─> Subscribe to Firebase signaling/{roomId}
  │     │     ├─> Exchange offers/answers
  │     │     ├─> Exchange ICE candidates
  │     │     └─> Establish P2P connection
  │     │
  │     └─> YouTube Player Initializes
  │           │
  │           ├─> Load YouTube IFrame API script
  │           ├─> Create player instance
  │           ├─> Set up event listeners
  │           └─> Wait for ready state
  │
  ├─> User Loads Video
  │     │
  │     ├─> extractVideoId(URL) → Get YouTube ID
  │     ├─> loadVideo(videoId) called
  │     ├─> updateState({videoId, currentTime: 0, isPlaying: true})
  │     ├─> Firebase updated with new video state
  │     ├─> Firebase callback fires (own update)
  │     ├─> Compares data.videoId vs currentVideoIdRef.current
  │     ├─> playerRef.loadVideoById(videoId, 0)
  │     ├─> currentVideoIdRef.current = videoId (update ref)
  │     └─> Video loads on both users' screens
  │
  ├─> User Presses Play
  │     │
  │     ├─> YouTube Player fires onStateChange (state: 1)
  │     ├─> VideoPlayer component detects play
  │     ├─> Calls onPlay(currentTime) callback
  │     ├─> Room.jsx calls sendPlay(currentTime)
  │     ├─> useRoomSync.sendPlay updates Firebase
  │     ├─> Firebase broadcasts to other user
  │     ├─> Other user receives update (remote update)
  │     ├─> Sets isRemoteUpdate.current = true
  │     ├─> Calls playerRef.playVideo()
  │     ├─> Player fires onStateChange event
  │     ├─> Event handler checks isRemoteUpdate flag
  │     ├─> Skips sending to Firebase (prevents loop)
  │     └─> After 1000ms, resets isRemoteUpdate.current = false
  │
  ├─> User Sends Chat Message
  │     │
  │     ├─> Types text in ChatBox input
  │     ├─> Clicks Send or presses Enter
  │     ├─> Calls sendChatMessage(text)
  │     ├─> Creates message object {text, userName, timestamp}
  │     ├─> Pushes to Firebase messages/{roomId}/
  │     ├─> Firebase broadcasts to all listeners
  │     ├─> Both users' message subscription fires
  │     ├─> Updates local messages state
  │     ├─> ChatBox re-renders with new message
  │     └─> Auto-scrolls to bottom
  │
  └─> User Leaves Room
        │
        ├─> Navigate away or close tab
        ├─> useEffect cleanup functions run
        ├─> Firebase subscriptions unsubscribe
        ├─> WebRTC connection closes
        ├─> Local/remote streams stopped
        └─> Resources released
```

---

## 📊 Data Flow

### 1. Video Synchronization Flow

#### A. Loading a New Video

```
User Action: Paste URL → Click "Load Video"
  │
  ├─> Room.jsx
  │     ├─> extractVideoId(url) → "dQw4w9WgXcQ"
  │     └─> loadVideo("dQw4w9WgXcQ")
  │
  ├─> useRoomSync.loadVideo()
  │     ├─> console.log: "loadVideo CALLED"
  │     ├─> console.log: "New videoId: dQw4w9WgXcQ"
  │     ├─> console.log: "Current ref: [previous_video_id]"
  │     └─> updateState({
  │           videoId: "dQw4w9WgXcQ",
  │           currentTime: 0,
  │           isPlaying: true
  │         })
  │
  ├─> useRoomSync.updateState()
  │     ├─> Check isRemoteUpdate.current → false (continue)
  │     ├─> Check roomId & userName → valid (continue)
  │     ├─> console.log: "✅ Sending update to Firebase"
  │     └─> setRoomState(prev => {
  │           const updatedState = {
  │             videoId: "dQw4w9WgXcQ",  // from newState
  │             isPlaying: true,
  │             currentTime: 0
  │           };
  │           updateVideoState(roomId, updatedState, userName);  // ← Firebase write
  │           return {...prev, ...updatedState, lastUpdated: Date.now()};
  │         })
  │
  ├─> Firebase Realtime Database
  │     ├─> /rooms/{roomId}/videoId = "dQw4w9WgXcQ"
  │     ├─> /rooms/{roomId}/isPlaying = true
  │     ├─> /rooms/{roomId}/currentTime = 0
  │     ├─> /rooms/{roomId}/lastUpdated = 1735286400000
  │     ├─> /rooms/{roomId}/updatedBy = "Alice"
  │     └─> Broadcasts to all subscribers
  │
  ├─> Firebase Subscription Callback (Both Users)
  │     ├─> console.log: "Room data received"
  │     ├─> Check if stale update (lastUpdated <= lastProcessedUpdate) → false
  │     ├─> Check if own update (data.updatedBy === userName)
  │     │
  │     ├─> User A (Alice - creator):
  │     │     ├─> isOwnUpdate = true
  │     │     ├─> console.log: "PROCESSING OWN UPDATE"
  │     │     ├─> console.log: "data.videoId: dQw4w9WgXcQ"
  │     │     ├─> console.log: "currentVideoIdRef.current: [old_id]"
  │     │     ├─> console.log: "Are they different? true"
  │     │     ├─> Condition met: data.videoId !== currentVideoIdRef.current
  │     │     ├─> console.log: "✅ LOADING NEW VIDEO ON OUR DEVICE"
  │     │     ├─> playerRef.current.loadVideoById("dQw4w9WgXcQ", 0)
  │     │     ├─> currentVideoIdRef.current = "dQw4w9WgXcQ"  // ← Update ref
  │     │     └─> lastProcessedUpdate.current = data.lastUpdated
  │     │
  │     └─> User B (Bob - partner):
  │           ├─> isOwnUpdate = false (remote update)
  │           ├─> console.log: "Processing remote update from: Alice"
  │           ├─> isRemoteUpdate.current = true  // ← Prevent loop
  │           ├─> Check if video changed: "dQw4w9WgXcQ" !== currentVideoIdRef.current
  │           ├─> console.log: "Loading new video: dQw4w9WgXcQ"
  │           ├─> currentVideoIdRef.current = "dQw4w9WgXcQ"
  │           ├─> player.loadVideoById("dQw4w9WgXcQ", 0)
  │           ├─> lastProcessedUpdate.current = data.lastUpdated
  │           └─> setTimeout(() => isRemoteUpdate.current = false, 1000)
  │
  └─> YouTube Player (Both Users)
        ├─> Loads video "dQw4w9WgXcQ"
        ├─> Fires onStateChange events (-1 → 3 → 1)
        ├─> VideoPlayer detects state: 1 (playing)
        ├─> Calls onPlay(currentTime) callback
        ├─> Room.jsx calls sendPlay(currentTime)
        ├─> useRoomSync.sendPlay() called
        │
        ├─> User A: isRemoteUpdate = false → sends update to Firebase
        └─> User B: isRemoteUpdate = true → skips update (loop prevented!)
```

#### B. Play/Pause Synchronization

```
User A Clicks Play
  │
  ├─> YouTube Player
  │     └─> onStateChange event (state: 1 = playing)
  │
  ├─> VideoPlayer.jsx
  │     ├─> Detects state change
  │     ├─> Checks isRemoteUpdateInProgress() → false
  │     ├─> Calls onPlay(getCurrentTime())
  │     └─> console.log: "Playing at: 5.234"
  │
  ├─> Room.jsx
  │     ├─> Receives onPlay event
  │     └─> Calls sendPlay(5.234)
  │
  ├─> useRoomSync.sendPlay()
  │     └─> updateState({isPlaying: true, currentTime: 5.234})
  │
  ├─> Firebase
  │     ├─> /rooms/{roomId}/isPlaying = true
  │     ├─> /rooms/{roomId}/currentTime = 5.234
  │     └─> Broadcasts to User B
  │
  ├─> User B Receives Update
  │     ├─> isRemoteUpdate.current = true
  │     ├─> player.playVideo()
  │     ├─> player.seekTo(5.234)
  │     └─> Videos now in sync!
  │
  └─> Loop Prevention
        ├─> User B's player fires onStateChange (state: 1)
        ├─> VideoPlayer checks isRemoteUpdateInProgress() → true
        ├─> Skips calling onPlay callback
        └─> No redundant Firebase update sent
```

#### C. Seek Synchronization

```
User A Seeks to 1:30 (90 seconds)
  │
  ├─> YouTube Player progress bar dragged
  │     └─> onStateChange or getCurrentTime() shows new position
  │
  ├─> VideoPlayer.jsx
  │     ├─> Detects currentTime changed by > 2 seconds (SEEK_THRESHOLD)
  │     ├─> Calls onSeek(90)
  │     └─> console.log: "Seeked to: 90"
  │
  ├─> Room.jsx
  │     └─> Calls sendSeek(90)
  │
  ├─> useRoomSync.sendSeek()
  │     └─> updateState({currentTime: 90})
  │
  ├─> Firebase
  │     ├─> /rooms/{roomId}/currentTime = 90
  │     └─> Broadcasts to User B
  │
  ├─> User B Receives Update
  │     ├─> isRemoteUpdate.current = true
  │     ├─> Checks if difference > SEEK_THRESHOLD (2 seconds)
  │     ├─> player.seekTo(90, true)
  │     └─> Both users now at same timestamp
  │
  └─> Small differences (<2 sec) are ignored to prevent jitter
```

### 2. WebRTC Video Call Flow

```
Both Users Join Room
  │
  ├─> useWebRTC Hook Initializes
  │
  ├─> User A (Initiator)
  │     ├─> navigator.mediaDevices.getUserMedia({video, audio})
  │     ├─> Gets local MediaStream
  │     ├─> Displays in local <video> element
  │     ├─> Creates RTCPeerConnection
  │     ├─> Adds local stream tracks to connection
  │     ├─> Sets up event handlers:
  │     │     ├─> ontrack → receives remote stream
  │     │     ├─> onicecandidate → sends ICE to Firebase
  │     │     └─> onconnectionstatechange → updates UI
  │     ├─> Waits for User B to join
  │     │
  │     └─> User B Joins (detected via Firebase)
  │           ├─> Creates SDP offer
  │           ├─> peerConnection.createOffer()
  │           ├─> peerConnection.setLocalDescription(offer)
  │           ├─> Saves offer to Firebase:
  │           │     /signaling/{roomId}/{userB_id}/offer = {type, sdp}
  │           └─> console.log: "Offer sent"
  │
  ├─> User B (Receiver)
  │     ├─> Gets local MediaStream (same as User A)
  │     ├─> Creates RTCPeerConnection
  │     ├─> Sets up event handlers
  │     ├─> Subscribes to Firebase signaling/{roomId}/{userB_id}/
  │     ├─> Receives offer from User A
  │     ├─> peerConnection.setRemoteDescription(offer)
  │     ├─> Creates SDP answer
  │     ├─> peerConnection.createAnswer()
  │     ├─> peerConnection.setLocalDescription(answer)
  │     ├─> Saves answer to Firebase:
  │     │     /signaling/{roomId}/{userA_id}/answer = {type, sdp}
  │     └─> console.log: "Answer sent"
  │
  ├─> User A Receives Answer
  │     ├─> Firebase subscription fires
  │     ├─> peerConnection.setRemoteDescription(answer)
  │     └─> console.log: "Answer received"
  │
  ├─> ICE Candidate Exchange (Both Users)
  │     ├─> peerConnection fires onicecandidate events
  │     ├─> Each candidate saved to Firebase:
  │     │     /signaling/{roomId}/{peerId}/candidates/{index} = {candidate, sdpMid, sdpMLineIndex}
  │     ├─> Other user receives candidates via subscription
  │     ├─> peerConnection.addIceCandidate(candidate)
  │     └─> ICE framework finds best connection path through NAT
  │
  ├─> Connection Established
  │     ├─> connectionState changes: "connecting" → "connected"
  │     ├─> ontrack event fires on both sides
  │     ├─> Receives remote MediaStream
  │     ├─> Sets remoteStream state
  │     ├─> Displays in remote <video> element
  │     └─> console.log: "Remote stream received"
  │
  └─> P2P Video Call Active
        ├─> Audio/video flows directly between users
        ├─> No server relay (unless behind symmetric NAT)
        ├─> Low latency (~100-500ms depending on network)
        └─> Mic toggle controls local stream audio track
```

### 3. Chat Message Flow

```
User A Types and Sends Message
  │
  ├─> ChatBox.jsx
  │     ├─> User types: "Hello!"
  │     ├─> Presses Enter or clicks Send button
  │     └─> Calls onSendMessage("Hello!")
  │
  ├─> Room.jsx
  │     └─> Calls sendChatMessage("Hello!")
  │
  ├─> useRoomSync.sendChatMessage()
  │     ├─> Validates text is not empty
  │     ├─> Creates message object:
  │     │     {
  │     │       text: "Hello!",
  │     │       userName: "Alice",
  │     │       timestamp: 1735286400000
  │     │     }
  │     ├─> Calls sendMessage(roomId, userName, "Hello!")
  │     └─> console.log: "Sending message: Hello!"
  │
  ├─> firebase.js sendMessage()
  │     ├─> const messageRef = push(ref(database, `messages/${roomId}`))
  │     ├─> set(messageRef, {text, userName, timestamp})
  │     └─> Firebase write completes
  │
  ├─> Firebase Realtime Database
  │     ├─> /messages/{roomId}/{-N1XYZ123}/
  │     │     ├─> text: "Hello!"
  │     │     ├─> userName: "Alice"
  │     │     └─> timestamp: 1735286400000
  │     └─> Broadcasts to all subscribers
  │
  ├─> Message Subscription (Both Users)
  │     ├─> onValue callback fires
  │     ├─> Gets snapshot of all messages
  │     ├─> Maps to array: [{id, text, userName, timestamp}, ...]
  │     ├─> Sorts by timestamp (ascending)
  │     ├─> Updates messages state
  │     └─> console.log: "Messages received: 5"
  │
  ├─> ChatBox Re-renders
  │     ├─> Maps over messages array
  │     ├─> Renders ChatMessage components
  │     ├─> New message appears at bottom
  │     └─> Auto-scrolls to latest message
  │
  └─> Both Users See Message
        ├─> User A sees their own message (echo)
        └─> User B sees message in real-time
```

### 4. Sync Loop Prevention Mechanism

The app uses multiple strategies to prevent infinite synchronization loops:

#### Strategy 1: isRemoteUpdate Flag

```
Firebase Update Arrives
  │
  ├─> Check if remote update (updatedBy !== userName)
  │
  ├─> If Remote:
  │     ├─> isRemoteUpdate.current = true  ← SET FLAG
  │     ├─> Apply changes to player
  │     ├─> Player fires events (onPlay, onPause, onSeek)
  │     ├─> Event handlers check isRemoteUpdate flag
  │     ├─> Flag is true → SKIP sending to Firebase
  │     └─> setTimeout(() => isRemoteUpdate.current = false, 1000)
  │
  └─> If Own Update:
        └─> Process normally (may need to apply to own player)
```

#### Strategy 2: lastProcessedUpdate Timestamp

```
Firebase Callback Fires
  │
  ├─> Receives data with lastUpdated timestamp
  │
  ├─> Compare: data.lastUpdated vs lastProcessedUpdate.current
  │
  ├─> If data.lastUpdated <= lastProcessedUpdate.current:
  │     ├─> console.log: "Skipping old update"
  │     └─> return (skip processing)
  │
  └─> If data.lastUpdated > lastProcessedUpdate.current:
        ├─> Process update
        └─> lastProcessedUpdate.current = data.lastUpdated
```

#### Strategy 3: currentVideoIdRef for Video Changes

```
Video Load Request
  │
  ├─> loadVideo(newVideoId)
  │
  ├─> updateState({videoId: newVideoId, ...})
  │
  ├─> Firebase Callback
  │     ├─> Compare: data.videoId vs currentVideoIdRef.current
  │     │
  │     ├─> If different:
  │     │     ├─> Load new video on player
  │     │     └─> currentVideoIdRef.current = data.videoId
  │     │
  │     └─> If same:
  │           └─> Skip loading (already loaded)
  │
  └─> Prevents reloading same video multiple times
```

#### Strategy 4: Functional setState to Avoid Stale Closures

```
Problem: updateState captured old roomState in closure
  │
  ├─> Old Approach (buggy):
  │     const updatedState = {
  │       videoId: newState.videoId ?? roomState.videoId,  ← STALE!
  │       ...
  │     };
  │
  └─> New Approach (fixed):
        setRoomState(prev => {
          const updatedState = {
            videoId: newState.videoId ?? prev.videoId,  ← FRESH!
            ...
          };
          updateVideoState(roomId, updatedState, userName);
          return {...prev, ...updatedState};
        });
```

This ensures play/pause events after loading a new video use the latest videoId, not the old one from closure.

---

## 🧩 Key Components Explained

### VideoPlayer Component

**Purpose**: Wraps YouTube IFrame Player API and provides controlled interface

**Key Features**:
- Dynamically loads YouTube IFrame API script
- Creates player instance with configuration
- Exposes imperative methods via `forwardRef` and `useImperativeHandle`
- Emits events to parent component
- Prevents sync loops by checking remote update flag

**API Surface**:
```javascript
// Exposed methods (via ref)
playerRef.current.playVideo()
playerRef.current.pauseVideo()
playerRef.current.seekTo(seconds, allowSeekAhead)
playerRef.current.loadVideoById(videoId, startSeconds)
playerRef.current.getPlayer() // Raw YouTube player

// Event callbacks (props)
onReady() // Player initialized and ready
onPlay(currentTime) // Video started playing
onPause(currentTime) // Video paused
onSeek(newTime) // User seeked to new position
isRemoteUpdateInProgress() // Function to check if applying remote update
```

**State Machine**:
- **Unstarted (-1)**: Initial state, video cued
- **Ended (0)**: Video finished playing
- **Playing (1)**: Currently playing
- **Paused (2)**: Paused by user or auto-pause
- **Buffering (3)**: Loading video data
- **Cued (5)**: Video loaded but not started

### VideoCall Component

**Purpose**: Renders WebRTC video streams and provides call controls

**Structure**:
```jsx
<div className="video-call-container">
  <video 
    ref={remoteVideoRef} 
    autoPlay 
    srcObject={remoteStream}  // Partner's stream
  />
  <video 
    ref={localVideoRef} 
    autoPlay 
    muted  // Prevent echo
    srcObject={localStream}   // Your stream
  />
  <button onClick={toggleMute}>
    {isMuted ? <MicOff /> : <MicOn />}
  </button>
</div>
```

**Mic Toggle Logic**:
```javascript
const toggleMute = () => {
  if (localStream) {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
    
    // Auto-pause integration
    if (onMicToggle) {
      onMicToggle(!isMuted); // Notify parent
    }
  }
};
```

### ChatBox Component

**Layout**:
```
┌─────────────────────────────┐
│  Chat Header (flex-shrink-0)│
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │ Messages (scrollable) │  │ ← min-h-0 enables scroll
│  │ overflow-y-auto       │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  Input (flex-shrink-0)      │
└─────────────────────────────┘
```

**Auto-scroll Implementation**:
```javascript
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
}, [messages]);
```

---

## 🪝 Custom Hooks Deep Dive

### useRoomSync Hook

**Responsibility**: Manages all Firebase Realtime Database synchronization

**State Variables**:
```javascript
const [roomState, setRoomState] = useState({
  videoId: '',           // Current YouTube video ID
  isPlaying: false,      // Playback state
  currentTime: 0,        // Playback position
  lastUpdated: 0,        // Timestamp
  updatedBy: '',         // Username
  participants: []       // Room participants
});
const [messages, setMessages] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [isConnected, setIsConnected] = useState(false);
const [error, setError] = useState(null);
```

**Refs (Mutable State)**:
```javascript
const isRemoteUpdate = useRef(false);         // Loop prevention flag
const lastProcessedUpdate = useRef(0);        // Timestamp tracking
const currentVideoIdRef = useRef('');         // Video change detection
```

**Core Functions**:

**`loadVideo(videoId)`**
```javascript
// Loads new video and syncs to Firebase
const loadVideo = useCallback((videoId) => {
  console.log('[useRoomSync] loadVideo CALLED');
  console.log('[useRoomSync] New videoId:', videoId);
  console.log('[useRoomSync] Current ref:', currentVideoIdRef.current);
  
  updateState({
    videoId: videoId,
    currentTime: 0,
    isPlaying: true
  });
}, [updateState]);
```

**`updateState(newState)`**
```javascript
// Critical function - updates Firebase with proper state handling
const updateState = useCallback(async (newState) => {
  // Guard: Skip if processing remote update
  if (isRemoteUpdate.current) {
    console.log('[useRoomSync] ❌ BLOCKED: Ignoring update during remote sync');
    return;
  }
  
  // Guard: Validate required data
  if (!roomId || !userName) {
    console.error('[useRoomSync] ❌ BLOCKED: Cannot update - missing roomId or userName');
    return;
  }
  
  console.log('[useRoomSync] ✅ Sending update to Firebase:', newState);
  
  try {
    // CRITICAL: Use functional setState to get fresh state
    setRoomState((prev) => {
      const updatedState = {
        videoId: newState.videoId ?? prev.videoId,        // Use latest from prev
        isPlaying: newState.isPlaying ?? prev.isPlaying,
        currentTime: newState.currentTime ?? prev.currentTime,
      };
      
      // Update Firebase
      updateVideoState(roomId, updatedState, userName);
      
      // Return new local state
      return {
        ...prev,
        ...updatedState,
        lastUpdated: Date.now(),
        updatedBy: userName,
      };
    });
  } catch (err) {
    console.error('[useRoomSync] Error updating state:', err);
    setError('Failed to sync video state');
  }
}, [roomId, userName]);
```

**Firebase Subscription Callback**:
```javascript
useEffect(() => {
  if (!roomId || !userName) return;
  
  const unsubscribe = subscribeToRoom(roomId, (data) => {
    console.log('[useRoomSync] Room data received:', data);
    
    setIsConnected(true);
    setIsLoading(false);
    
    // Guard: Skip old updates
    if (data.lastUpdated <= lastProcessedUpdate.current) {
      console.log('[useRoomSync] Skipping old update');
      return;
    }
    
    const isOwnUpdate = data.updatedBy === userName;
    
    if (isOwnUpdate) {
      // Process own update (e.g., load video on our player too)
      console.log('[useRoomSync] PROCESSING OWN UPDATE');
      
      if (data.videoId && data.videoId !== currentVideoIdRef.current && playerRef?.current) {
        console.log('[useRoomSync] ✅ LOADING NEW VIDEO ON OUR DEVICE:', data.videoId);
        playerRef.current.loadVideoById(data.videoId, data.currentTime || 0);
        currentVideoIdRef.current = data.videoId;
        
        if (!data.isPlaying) {
          setTimeout(() => playerRef.current?.pauseVideo(), 500);
        }
      }
      
      setRoomState(prev => ({...prev, ...data}));
      lastProcessedUpdate.current = data.lastUpdated;
      return;
    }
    
    // Remote update - apply to player
    console.log('[useRoomSync] Processing remote update from:', data.updatedBy);
    isRemoteUpdate.current = true;
    
    setRoomState(prev => ({...prev, ...data}));
    
    if (playerRef?.current) {
      // Handle video change
      if (data.videoId && data.videoId !== currentVideoIdRef.current) {
        console.log('[useRoomSync] Loading new video:', data.videoId);
        currentVideoIdRef.current = data.videoId;
        playerRef.current.loadVideoById(data.videoId, data.currentTime || 0);
        
        if (!data.isPlaying) {
          setTimeout(() => playerRef.current?.pauseVideo(), 500);
        }
      } else {
        // Handle play/pause/seek
        const currentTime = playerRef.current.getCurrentTime();
        const timeDiff = Math.abs(currentTime - data.currentTime);
        
        // Seek if difference > threshold
        if (timeDiff > SEEK_THRESHOLD) {
          playerRef.current.seekTo(data.currentTime, true);
        }
        
        // Sync play/pause
        if (data.isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      }
    }
    
    lastProcessedUpdate.current = data.lastUpdated;
    
    // Reset flag after delay
    setTimeout(() => {
      isRemoteUpdate.current = false;
    }, 1000);
  });
  
  return () => {
    unsubscribe();
    currentVideoIdRef.current = '';
    lastProcessedUpdate.current = 0;
  };
}, [roomId, userName, playerRef]);
```

### useWebRTC Hook

**Responsibility**: Manages WebRTC peer-to-peer video calling

**State Variables**:
```javascript
const [localStream, setLocalStream] = useState(null);    // Your camera/mic
const [remoteStream, setRemoteStream] = useState(null);  // Partner's stream
const [isMuted, setIsMuted] = useState(false);
const [connectionState, setConnectionState] = useState('new');
```

**Refs**:
```javascript
const peerConnection = useRef(null);  // RTCPeerConnection instance
const peerId = useRef(null);          // Partner's peer ID
```

**WebRTC Configuration**:
```javascript
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};
```

**Initialization Flow**:
```javascript
const initializeWebRTC = useCallback(async () => {
  try {
    // 1. Get local media
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: true
    });
    setLocalStream(stream);
    
    // 2. Create peer connection
    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;
    
    // 3. Add local tracks
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });
    
    // 4. Handle remote tracks
    pc.ontrack = (event) => {
      console.log('[WebRTC] Remote stream received');
      setRemoteStream(event.streams[0]);
    };
    
    // 5. Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        saveSignalingData(roomId, peerId.current, 'candidates', event.candidate);
      }
    };
    
    // 6. Monitor connection state
    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
    };
    
  } catch (err) {
    console.error('[WebRTC] Initialization failed:', err);
  }
}, [roomId]);
```

**Offer/Answer Exchange**:
```javascript
const createOffer = useCallback(async () => {
  if (!peerConnection.current) return;
  
  const offer = await peerConnection.current.createOffer();
  await peerConnection.current.setLocalDescription(offer);
  
  await saveSignalingData(roomId, peerId.current, 'offer', {
    type: offer.type,
    sdp: offer.sdp
  });
}, [roomId]);

const handleOffer = useCallback(async (offer) => {
  if (!peerConnection.current) return;
  
  await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.current.createAnswer();
  await peerConnection.current.setLocalDescription(answer);
  
  await saveSignalingData(roomId, peerId.current, 'answer', {
    type: answer.type,
    sdp: answer.sdp
  });
}, [roomId]);
```

---

## 🔐 State Management Patterns

### 1. React State for UI

Used for data that triggers re-renders:
```javascript
const [roomState, setRoomState] = useState({...});  // Video state
const [messages, setMessages] = useState([]);       // Chat messages
const [isLoading, setIsLoading] = useState(true);   // Loading UI
```

### 2. Refs for Non-UI State

Used for values that don't need re-renders but must persist:
```javascript
const isRemoteUpdate = useRef(false);           // Loop prevention flag
const lastProcessedUpdate = useRef(0);          // Timestamp tracking
const currentVideoIdRef = useRef('');           // Video ID tracking
const playerRef = useRef(null);                 // YouTube player instance
```

### 3. LocalStorage for Persistence

Used for data that survives page refreshes:
```javascript
localStorage.setItem('iamthere_userName', userName);
const savedName = localStorage.getItem('iamthere_userName');
```

### 4. Firebase for Shared State

Used for data synchronized across users:
```javascript
// Write
await updateVideoState(roomId, {videoId, isPlaying, currentTime}, userName);

// Read (subscription)
subscribeToRoom(roomId, (data) => {
  setRoomState(data);  // Updates local state when Firebase changes
});
```

### State Update Patterns

**❌ Bad: Stale Closure**
```javascript
const updateState = useCallback((newState) => {
  const updatedState = {
    videoId: newState.videoId ?? roomState.videoId,  // roomState is stale!
    ...
  };
  updateVideoState(roomId, updatedState, userName);
}, [roomId, userName, roomState]);  // roomState in dependencies
```

**✅ Good: Functional setState**
```javascript
const updateState = useCallback((newState) => {
  setRoomState(prev => {  // Get fresh state via callback
    const updatedState = {
      videoId: newState.videoId ?? prev.videoId,  // prev is always fresh
      ...
    };
    updateVideoState(roomId, updatedState, userName);
    return {...prev, ...updatedState};
  });
}, [roomId, userName]);  // roomState NOT in dependencies
```

---

## 📡 Firebase Database Schema

### /rooms/{roomId}

Stores video synchronization state for each room.

```json
{
  "rooms": {
    "ABC123": {
      "videoId": "dQw4w9WgXcQ",
      "isPlaying": true,
      "currentTime": 42.5,
      "lastUpdated": 1735286400000,
      "updatedBy": "Alice",
      "createdAt": 1735286000000,
      "createdBy": "Alice",
      "participants": ["Alice", "Bob"]
    }
  }
}
```

**Fields**:
- `videoId` (string, 11 chars): YouTube video identifier
- `isPlaying` (boolean): Current playback state
- `currentTime` (number): Playback position in seconds
- `lastUpdated` (number): Unix timestamp of last update
- `updatedBy` (string): Username who made the update
- `createdAt` (number): Room creation timestamp
- `createdBy` (string): Username who created the room
- `participants` (array): List of usernames in the room

### /messages/{roomId}

Stores chat messages for each room.

```json
{
  "messages": {
    "ABC123": {
      "-N1XYZ123": {
        "text": "Hello!",
        "userName": "Alice",
        "timestamp": 1735286400000
      },
      "-N1XYZ124": {
        "text": "Hi there!",
        "userName": "Bob",
        "timestamp": 1735286401000
      }
    }
  }
}
```

**Fields**:
- `text` (string): Message content
- `userName` (string): Sender's display name
- `timestamp` (number): When message was sent

### /signaling/{roomId}/{peerId}

Stores WebRTC signaling data for peer connections.

```json
{
  "signaling": {
    "ABC123": {
      "bob_123": {
        "offer": {
          "type": "offer",
          "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\n..."
        },
        "candidates": {
          "0": {
            "candidate": "candidate:1 1 UDP 2122260223 192.168.1.100 54321 typ host",
            "sdpMid": "0",
            "sdpMLineIndex": 0
          }
        }
      },
      "alice_456": {
        "answer": {
          "type": "answer",
          "sdp": "v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\n..."
        },
        "candidates": {
          "0": {
            "candidate": "candidate:2 1 UDP 2122260222 192.168.1.101 54322 typ host",
            "sdpMid": "0",
            "sdpMLineIndex": 0
          }
        }
      }
    }
  }
}
```

**Structure**:
- `offer`: SDP offer from initiating peer
- `answer`: SDP answer from receiving peer
- `candidates`: Array of ICE candidates for NAT traversal

---

## 🌐 Deployment


## 🌐 Deployment

### Option 1: Firebase Hosting (Recommended)

Firebase Hosting provides free hosting with HTTPS, perfect for WebRTC.

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase

```bash
firebase login
```

#### Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

Configuration:
- **Project**: Select your existing Firebase project
- **Public directory**: `dist`
- **Single-page app**: `Yes`
- **Overwrite index.html**: `No`
- **GitHub integration**: Optional

#### Step 4: Build the Project

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

#### Step 5: Deploy

```bash
firebase deploy --only hosting
```

Your app will be live at:
```
https://your-project-id.web.app
https://your-project-id.firebaseapp.com
```

#### Step 6: (Optional) Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

---

### Option 2: Vercel

Vercel offers zero-config deployment with automatic HTTPS.

#### Deploy via GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Vite configuration
6. Click "Deploy"

Your app will be live at:
```
https://your-project.vercel.app
```

#### Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_DATABASE_URL=your_db_url
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Redeploy the project

---

### Option 3: Netlify

Netlify provides similar features to Vercel.

#### Deploy via GitHub

1. Push code to GitHub (same as Vercel)
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "New site from Git"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

Your app will be live at:
```
https://your-site-name.netlify.app
```

---

### Option 4: Local HTTPS for Testing

For testing WebRTC locally with HTTPS (required for camera/mic on mobile):

#### Using ngrok

```bash
# Start your dev server
npm run dev

# In another terminal, start ngrok
ngrok http 5173
```

ngrok will provide an HTTPS URL:
```
https://abc123.ngrok.io
```

Share this URL to test on mobile devices.

#### Using mkcert (Recommended for Development)

```bash
# Install mkcert
brew install mkcert  # macOS
# or
choco install mkcert # Windows

# Create local CA
mkcert -install

# Generate certificates
mkcert localhost 127.0.0.1 ::1

# Update vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
  },
});
```

Access at: `https://localhost:5173`

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Optional: Feature Flags
VITE_ENABLE_AUTO_PAUSE=true
VITE_SEEK_THRESHOLD=2
```

Update `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

> 🔒 **Security**: Never commit `.env` to version control. Add it to `.gitignore`.

### Customization Options

#### Auto-pause on Mic Unmute

In `src/pages/Room.jsx`:

```javascript
const handleMicToggle = (isMuted) => {
  if (!isMuted) {
    // Mic is now unmuted - pause video
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  } else {
    // Mic is now muted - resume video (optional)
    if (playerRef.current && roomState.isPlaying) {
      playerRef.current.playVideo();
    }
  }
};
```

Set to `false` to disable this feature.

#### Sync Threshold

In `src/hooks/useRoomSync.js`:

```javascript
const SEEK_THRESHOLD = 2; // seconds
```

Increase for slower connections, decrease for tighter sync.

#### WebRTC Media Constraints

In `src/hooks/useWebRTC.js`:

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: { 
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true
  }
});
```

Adjust for quality vs. bandwidth tradeoff.

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Failed to create room" Error

**Symptoms**: Room creation fails with error message

**Causes**:
- Firebase configuration incorrect
- Missing `databaseURL` in config
- Database rules prevent writes

**Solutions**:
```bash
# Check firebase.js has correct config
# Verify databaseURL is present:
databaseURL: "https://your-project-default-rtdb.firebaseio.com"

# Check Firebase Console → Realtime Database → Rules
# Ensure rules allow writes (at least for development)
```

#### 2. Video Not Syncing

**Symptoms**: One user's actions don't reflect on the other's screen

**Causes**:
- Both users in different rooms
- Firebase connection lost
- Browser console shows errors

**Solutions**:
```bash
# Verify both users have same room code
# Check browser console for errors
# Verify Firebase connection status (green dot in header)
# Clear browser cache and hard reload (Ctrl+Shift+R)
```

**Debug Logging**:
Open browser console and look for:
```
[useRoomSync] Room data received
[useRoomSync] PROCESSING OWN UPDATE / Processing remote update
[useRoomSync] ✅ LOADING NEW VIDEO / ❌ SKIPPING VIDEO LOAD
```

#### 3. YouTube Player Not Loading

**Symptoms**: Black screen where video should be

**Causes**:
- Video not embeddable (restricted by uploader)
- YouTube IFrame API failed to load
- Ad blockers interfering
- Invalid video ID

**Solutions**:
```bash
# Try a different video (ensure it's embeddable)
# Disable ad blockers temporarily
# Check browser console for YouTube API errors
# Verify video ID is exactly 11 characters
```

#### 4. Video Call Not Working

**Symptoms**: Local video shows but remote video doesn't, or vice versa

**Causes**:
- Camera/mic permissions denied
- Not using HTTPS (required for WebRTC)
- Firewall blocking WebRTC
- Symmetric NAT (both users behind strict NAT)

**Solutions**:
```bash
# Check browser permissions: Settings → Privacy → Camera/Microphone
# Use HTTPS (deploy to Vercel/Netlify or use ngrok)
# Check browser console for WebRTC errors
# Try from different network (mobile data vs. WiFi)
```

**WebRTC Debug**:
```
[WebRTC] Initializing...
[WebRTC] Local stream acquired
[WebRTC] Offer sent
[WebRTC] Answer received
[WebRTC] ICE candidate: candidate:...
[WebRTC] Connection state: connecting → connected
[WebRTC] Remote stream received
```

#### 5. Infinite Sync Loop

**Symptoms**: Video keeps jumping, play/pause rapidly toggling

**Causes**:
- `isRemoteUpdate` flag not working
- Multiple tabs open for same user
- Stale state closure issue

**Solutions**:
```bash
# Close duplicate tabs (only one tab per user)
# Hard refresh the page (Ctrl+Shift+R)
# Check code for the latest sync loop prevention logic
```

If issue persists, check that `isRemoteUpdate.current` is properly set and reset:
```javascript
// In Firebase callback
isRemoteUpdate.current = true;
// ... apply changes ...
setTimeout(() => {
  isRemoteUpdate.current = false;
}, 1000);
```

#### 6. Chat Messages Not Appearing

**Symptoms**: Sent messages don't show up

**Causes**:
- Firebase rules prevent writes to messages path
- userName not set properly
- Subscription not active

**Solutions**:
```bash
# Check localStorage has username: localStorage.getItem('iamthere_userName')
# Verify Firebase rules allow writes to /messages/{roomId}
# Check console for subscription logs: "Messages received: X"
```

#### 7. Room Code Not Generating

**Symptoms**: Create room button does nothing

**Causes**:
- Firebase initialization failed
- Name not entered
- JavaScript error

**Solutions**:
```bash
# Enter a username before clicking create
# Check browser console for errors
# Verify Firebase SDK is loaded (network tab)
```

#### 8. "Connection Lost" Status

**Symptoms**: Firebase connection indicator shows red/disconnected

**Causes**:
- Network issue
- Firebase project quota exceeded
- Database URL incorrect

**Solutions**:
```bash
# Check internet connection
# Verify Firebase Console shows database is active
# Check Firebase usage quotas (free tier limits)
# Restart development server: npm run dev
```

---

## 🔐 Security Recommendations

### For Production Deployment

#### 1. Implement Authentication

**Add Firebase Authentication**:

```bash
npm install firebase
```

```javascript
// src/firebase.js
import { getAuth, signInAnonymously } from 'firebase/auth';

const auth = getAuth(app);

// Auto sign-in users anonymously
export const signInUser = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid;
  } catch (error) {
    console.error('Auth error:', error);
  }
};
```

#### 2. Update Database Rules

**Authenticated Access**:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['videoId', 'isPlaying', 'currentTime', 'lastUpdated', 'updatedBy'])",
        "videoId": {
          ".validate": "newData.isString() && newData.val().length === 11"
        },
        "isPlaying": {
          ".validate": "newData.isBoolean()"
        },
        "currentTime": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "lastUpdated": {
          ".validate": "newData.isNumber()"
        },
        "updatedBy": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 50"
        },
        "participants": {
          "$userId": {
            ".validate": "newData.isString()"
          }
        }
      }
    },
    "messages": {
      "$roomId": {
        ".read": "auth != null",
        "$messageId": {
          ".write": "auth != null && !data.exists()",
          ".validate": "newData.hasChildren(['text', 'userName', 'timestamp']) && newData.child('text').val().length > 0 && newData.child('text').val().length <= 500"
        }
      }
    },
    "signaling": {
      "$roomId": {
        "$peerId": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
  }
}
```

#### 3. Add Rate Limiting

**Client-side Throttling**:

```javascript
import { throttle } from 'lodash';

const throttledSendSeek = throttle((newTime) => {
  sendSeek(newTime);
}, 500); // Max once per 500ms
```

#### 4. Room Expiration

**Firebase Cloud Function** (optional):

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Delete rooms older than 24 hours
exports.cleanupOldRooms = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.database();
    const now = Date.now();
    const cutoff = now - (24 * 60 * 60 * 1000); // 24 hours ago

    const roomsRef = db.ref('rooms');
    const snapshot = await roomsRef.once('value');
    
    const updates = {};
    snapshot.forEach(child => {
      if (child.val().createdAt < cutoff) {
        updates[`rooms/${child.key}`] = null;
        updates[`messages/${child.key}`] = null;
        updates[`signaling/${child.key}`] = null;
      }
    });

    return db.ref().update(updates);
  });
```

#### 5. Content Security Policy

Add to `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://www.youtube.com https://www.gstatic.com https://firebase.googleapis.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://i.ytimg.com data:;
  connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com;
  frame-src https://www.youtube.com;
  media-src 'self' blob:;
">
```

---

## 🚀 Future Enhancements

### Planned Features

#### High Priority
- [ ] **User Authentication** - Sign in with Google/Email
- [ ] **Room Passwords** - Private rooms with password protection
- [ ] **User Presence** - Online/offline indicators
- [ ] **Room Persistence** - Save room history
- [ ] **Mobile App** - React Native wrapper

#### Medium Priority
- [ ] **Video Queue** - Playlist functionality for multiple videos
- [ ] **Emoji Reactions** - Quick reactions to video moments
- [ ] **Voice Chat** - Audio-only mode (lower bandwidth)
- [ ] **Screen Sharing** - Share your screen instead of camera
- [ ] **Picture-in-Picture** - Floating video call window
- [ ] **Keyboard Shortcuts** - Play/pause with spacebar, etc.

#### Low Priority
- [ ] **Multiple Video Sources** - Vimeo, Dailymotion support
- [ ] **Watch History** - Track watched videos
- [ ] **Bookmarks** - Save favorite timestamps
- [ ] **Themes** - Light mode, custom colors
- [ ] **Internationalization** - Multi-language support

### Technical Improvements

- [ ] **TypeScript Migration** - Type safety
- [ ] **Unit Tests** - Jest + React Testing Library
- [ ] **E2E Tests** - Playwright or Cypress
- [ ] **Service Workers** - Offline support, PWA
- [ ] **Push Notifications** - Partner joined, new message
- [ ] **Analytics** - Usage tracking with Google Analytics
- [ ] **Error Tracking** - Sentry integration
- [ ] **Performance Monitoring** - Lighthouse CI
- [ ] **Code Splitting** - Lazy load routes
- [ ] **CDN Integration** - CloudFlare for static assets

---

## 📊 Performance Considerations

### Optimization Tips

**1. Video Quality**: Lower resolution reduces bandwidth
```javascript
// Adjust in useWebRTC.js
video: { width: 640, height: 480 }  // Lower bandwidth
// vs
video: { width: 1280, height: 720 } // Higher quality
```

**2. Sync Threshold**: Higher threshold reduces Firebase writes
```javascript
const SEEK_THRESHOLD = 5; // Less sensitive, fewer updates
```

**3. Debounce Updates**: Limit Firebase writes during rapid changes
```javascript
const debouncedUpdate = debounce(updateState, 300);
```

**4. Message Pagination**: Load chat messages in batches
```javascript
const query = ref(database, `messages/${roomId}`).limitToLast(50);
```

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 iamthere

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Technologies & Services

- **[React](https://reactjs.org/)** - UI library by Meta
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service by Google
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)** - Video playback API
- **[WebRTC](https://webrtc.org/)** - Real-time communication standard
- **[Google STUN Servers](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)** - NAT traversal assistance

### Inspiration

This project was inspired by the need to stay connected with loved ones during times of distance. Special thanks to all long-distance couples and friends who need a simple way to watch videos together.

---

## 📞 Support & Contact

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/developerkunalonline/iamthere/issues)
- **Discussions**: [GitHub Discussions](https://github.com/developerkunalonline/iamthere/discussions)
- **Email**: developer.kunal.online@gmail.com

### Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📈 Project Stats

- **Lines of Code**: ~2,000+ (JavaScript/JSX)
- **Components**: 8 React components
- **Custom Hooks**: 2 (useRoomSync, useWebRTC)
- **Dependencies**: 4 core (React, React Router, Firebase, React DOM)
- **Build Size**: ~150KB (gzipped)
- **Load Time**: <2s on average connection

---

<div align="center">

## ❤️ Made with Love

**iamthere** - Bringing people together, one video at a time.

**Happy Watching! 🎬🍿**

[⬆ Back to Top](#-iamthere---be-there-together)

</div>

---

*Last Updated: December 27, 2025*
