# Quick Chat and Audio Call Web-Application. 

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

## Project structure

```text
Quick-Chat/
├── client/                 # React + Vite application
│   ├── context/            # Authentication and chat state
│   └── src/components/     # Sidebar, chat, and profile panels
├── server/                 # Express, Socket.IO, and MongoDB API
│   ├── controllers/
│   ├── models/             # User, Message, and Call models
│   └── routes/
└── README.md
```

## Getting started

### 1. Prerequisites

- Node.js 18 or later
- MongoDB (local instance or Atlas)
- A Cloudinary account for profile and chat images

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Install and run

Open two terminals from the project root.

```bash
cd server
npm install
npm start
```

```bash
cd client
npm install
npm run dev
```

The client normally runs at `http://localhost:5173`; the API and Socket.IO server run at `http://localhost:5000`.

## Available scripts

| Location | Command | Description |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Create a production build |
| `client` | `npm run lint` | Run ESLint |
| `server` | `npm start` | Start the API with nodemon |

## API overview

| Route | Purpose |
| --- | --- |
| `/api/auth` | Signup, login, session check, and profile updates |
| `/api/messages` | Contacts, messages, image sending, and read status |
| `/api/calls/:userId` | Call history for a conversation |

## Real-time events

Socket.IO provides online presence, incoming messages, typing activity, message-read updates, and WebRTC call signaling. Audio media is sent directly between the two browsers; Socket.IO only exchanges the information needed to establish the connection.

> Audio calls require microphone permission and a secure context in production (HTTPS). For reliable calls across restrictive networks, add a TURN server to the WebRTC ICE configuration.

## Development status

The core chat, read receipts, typing status, image sharing, online presence, audio calls, and call history are implemented. Before production deployment, configure restrictive CORS origins, add a TURN service, protect rate-sensitive routes, and keep all environment secrets outside version control.
