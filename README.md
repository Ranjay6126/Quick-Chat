# Quick Chat and Audio Call Web-Application.
https://quick-chat-call-application.vercel.app/

QuickChat is a full-stack real-time messaging application for private text, image, and audio conversations. It pairs a responsive React interface with an Express, MongoDB, and Socket.IO backend.

## Current features

- Secure signup, login, JWT session validation, and profile editing
- One-to-one real-time text messaging with image uploads through Cloudinary
- Online presence, unread-message badges, read receipts, and live typing indicators
- Recent conversations ordered before older conversations
- Responsive desktop and mobile chat layouts
- WebRTC audio calls with incoming-call prompts and browser notifications (when permitted)
- Persistent call history, conversation media gallery, and contact details
- Modern glass-style chat, authentication, and profile interfaces

## Tech stack

- **Client:** React 19, Vite, Tailwind CSS 4, React Router, Axios, Socket.IO Client
- **Server:** Node.js, Express, Socket.IO, MongoDB/Mongoose, JWT, bcryptjs
- **Media:** Cloudinary
- **Voice calls:** WebRTC with a public STUN server for peer discovery



## Getting started

### 1. Prerequisites

- Node.js 18 or later
- MongoDB (local instance or Atlas)
- A Cloudinary account for profile and chat images


Create client/.env

env
VITE_BACKEND_URL=http://localhost:5000


### 3. Install and run

Open two terminals from the project root.

cd server
npm install
npm start


cd client
npm install
npm run dev

The client normally runs at http://localhost:5173 ; the API and Socket.IO server run at http://localhost:5000.

---



## Real-time events

Socket.IO provides online presence, incoming messages, typing activity, message-read updates, and WebRTC call signaling. Audio media is sent directly between the two browsers; Socket.IO only exchanges the information needed to establish the connection.

> Audio calls require microphone permission and a secure context in production (HTTPS). For reliable calls across restrictive networks, add a TURN server to the WebRTC ICE configuration.

## Development status

The core chat, read receipts, typing status, image sharing, online presence, audio calls, and call history are implemented. Before production deployment:

- Restrict CORS origins (never use )
- Add a TURN service for reliable WebRTC
- Add rate limiting on auth and message-send endpoints
- Use HTTPS end-to-end
- Keep all environment secrets outside version control
