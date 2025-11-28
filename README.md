# 🎬 Watch Together - YouTube Sync

A real-time YouTube watch party application that allows couples or friends to watch YouTube videos together in **perfect sync**. Built with React, Firebase Realtime Database, and the YouTube IFrame Player API.

![Watch Together Banner](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Watch+Together)

## ✨ Features

### Core Features
- 🎥 **Real-time Video Sync** - Play, pause, and seek are instantly synced
- 💬 **Live Chat** - Chat with your partner in real-time
- 🚪 **Room System** - Create or join rooms with 6-character codes
- 🌙 **Dark Theme** - Beautiful modern dark UI

### Video Sync Capabilities
- ▶️ Play synchronization
- ⏸️ Pause synchronization
- ⏩ Seek synchronization
- 🔄 New video load synchronization

### Technical Features
- 🔥 Serverless architecture using Firebase
- ⚡ Real-time updates with Firebase Realtime Database
- 🎮 YouTube IFrame Player API integration
- 📱 Fully responsive design (mobile & desktop)
- 🔒 Loop prevention for sync events

## 📁 Project Structure

```
watch-together-youtube/
├── public/
│   └── vite.svg                 # App favicon
├── src/
│   ├── components/
│   │   ├── ChatBox.jsx          # Chat interface component
│   │   ├── ChatMessage.jsx      # Individual chat message
│   │   ├── RoomHeader.jsx       # Room header with code & controls
│   │   └── VideoPlayer.jsx      # YouTube player wrapper
│   ├── hooks/
│   │   └── useRoomSync.js       # Firebase sync custom hook
│   ├── pages/
│   │   ├── Home.jsx             # Landing page (create/join room)
│   │   └── Room.jsx             # Main watch party room
│   ├── App.jsx                  # Main app with routing
│   ├── firebase.js              # Firebase configuration
│   ├── index.css                # Global styles & Tailwind
│   └── main.jsx                 # React entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.js               # Vite build configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A **Firebase account** - [Sign up](https://firebase.google.com/)

### Step 1: Clone and Install

```bash
# Clone the repository (or download the files)
cd watch-together-youtube

# Install dependencies
npm install
```

### Step 2: Set Up Firebase

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Enter a project name (e.g., "watch-together")
   - Follow the setup wizard

2. **Enable Realtime Database**
   - In Firebase Console, click "Build" → "Realtime Database"
   - Click "Create Database"
   - Choose your database location
   - Start in **test mode** (for development)

3. **Set Database Rules**
   - In Realtime Database, go to the "Rules" tab
   - Replace with the following rules (for development):
   
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

   > ⚠️ **Warning**: These rules allow anyone to read/write. For production, implement proper authentication.

4. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click the web icon (`</>`) to add a web app
   - Register your app
   - Copy the `firebaseConfig` object

5. **Update Firebase Config**
   - Open `src/firebase.js`
   - Replace the placeholder values with your config:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "https://your-project-default-rtdb.firebaseio.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

   > 📝 **Important**: Make sure to include the `databaseURL` - it's required for Realtime Database!

### Step 3: Run Development Server

```bash
# Start the development server
npm run dev
```

The app will open at `http://localhost:3000`

## 🎮 How to Use

### Creating a Room

1. Open the app in your browser
2. Enter your display name
3. Click "Create New Room"
4. Share the 6-character room code with your partner

### Joining a Room

1. Open the app in your browser
2. Enter your display name
3. Enter the room code shared by your partner
4. Click "Join Room"

### Watching Together

1. Paste a YouTube URL in the input field
2. Click "Load Video"
3. Play, pause, or seek - your partner's video will sync!
4. Use the chat to communicate

## 🌐 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite `index.html`

4. **Build the Project**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

Your app will be live at `https://your-project.web.app`

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and configure the build

### Deploy to Netlify

1. Push your code to GitHub
2. Import the repository in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

## 🔧 Configuration

### Environment Variables (Optional)

For production, you can use environment variables:

Create a `.env` file:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `firebase.js`:
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

## 📊 Firebase Data Structure

```
rooms/
  {roomId}/
    videoId: string           # YouTube video ID
    isPlaying: boolean        # Playback state
    currentTime: number       # Current time in seconds
    lastUpdated: number       # Timestamp
    updatedBy: string         # User who made the update
    createdAt: number         # Room creation timestamp
    createdBy: string         # Room creator name
    messages/
      {messageId}/
        sender: string        # Message sender name
        text: string          # Message content
        timestamp: number     # When sent
```

## 🛡️ Security Recommendations

For production deployment:

1. **Implement Authentication**
   - Add Firebase Authentication
   - Use anonymous auth or social login

2. **Update Database Rules**
   ```json
   {
     "rules": {
       "rooms": {
         "$roomId": {
           ".read": "auth != null",
           ".write": "auth != null",
           "messages": {
             "$messageId": {
               ".validate": "newData.hasChildren(['sender', 'text', 'timestamp'])"
             }
           }
         }
       }
     }
   }
   ```

3. **Add Rate Limiting**
   - Implement client-side throttling
   - Use Firebase Cloud Functions for server-side validation

4. **Room Expiration**
   - Add a Cloud Function to delete old rooms
   - Set TTL on room documents

## 🔮 Future Improvements

Here are some ideas for extending the app:

### Features
- [ ] User authentication (sign in with Google)
- [ ] Video queue/playlist
- [ ] Emoji reactions
- [ ] Voice chat integration
- [ ] Screen sharing
- [ ] Multiple video sources (Vimeo, etc.)
- [ ] Room passwords
- [ ] User presence indicators
- [ ] Video timestamps in chat

### Technical
- [ ] Service workers for offline support
- [ ] Push notifications
- [ ] WebRTC for lower latency
- [ ] Server-side rendering
- [ ] Analytics integration
- [ ] Error tracking (Sentry)

## 🐛 Troubleshooting

### "Failed to create room" Error
- Check Firebase configuration in `src/firebase.js`
- Ensure `databaseURL` is included
- Verify database rules allow writes

### Video Not Syncing
- Check browser console for errors
- Ensure both users are in the same room
- Verify Firebase connection (green dot in header)

### YouTube Player Not Loading
- Check if the video is embeddable
- Ensure no ad blockers are interfering
- Try a different video

### Infinite Sync Loop
- The app has built-in loop prevention
- If occurring, check `isRemoteUpdate` flag in `useRoomSync.js`

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)

---

Made with ❤️ for couples who love watching videos together

**Happy Watching! 🎬🍿**
# iamthere
