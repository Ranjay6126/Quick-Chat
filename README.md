# Quick Chat & Audio Call Web Application

> A full-stack real-time messaging application with private text, image, and **WebRTC audio call** conversations. Built with the MERN stack + Socket.IO.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Environment Setup](#environment-setup)
7. [Installation & Running](#installation--running)
8. [Standard Flow — How the App Works](#standard-flow--how-the-app-works)
9. [Available Scripts](#available-scripts)
10. [REST API Reference](#rest-api-reference)
11. [Socket.IO Real-Time Events](#socketio-real-time-events)
12. [Database Models](#database-models)
13. [Deployment Notes](#deployment-notes)

---

## Features

### 🔐 Authentication
- Secure **signup** and **login** with JWT-based sessions
- Profile editing (name, bio, profile picture uploaded to **Cloudinary**)
- Token validation on protected routes
- Passwords hashed with **bcryptjs**

### 💬 Chat
- One-to-one **real-time text messaging** via Socket.IO
- **Image uploads** in chat through Cloudinary
- **Online/offline presence** indicators
- **Unread-message badges** on each conversation
- **Read receipts** (seen / unseen status)
- **Live typing indicators**
- Recent conversations sorted to the top
- Conversation **media gallery** (all shared images)

### 📞 WebRTC Audio Calls
- **Incoming-call prompts** with caller details
- **Browser notifications** when calls arrive (if permission is granted)
- **WebRTC peer-to-peer audio** using public STUN for peer discovery
- **Persistent call history** per conversation (missed / completed / cancelled + duration)
- Contact details panel inside the chat view

### 🎨 UI / UX
- Responsive **desktop and mobile** chat layouts
- Modern **glass-style** authentication, chat, and profile interfaces
- Sidebar user list + center chat + right details 3-column desktop layout

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19 · Vite (Rolldown-Vite) · Tailwind CSS 4 · React Router 7 · Axios · Socket.IO Client · react-hot-toast |
| **Backend** | Node.js · Express 5 · Socket.IO 4 · Mongoose 8 · JWT · bcryptjs · Cloudinary SDK · nodemon |
| **Database** | MongoDB (local or Atlas) |
| **Voice** | WebRTC with public STUN server for ICE peer discovery |
| **Media Storage** | Cloudinary (profile pictures + chat images) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                    │
│  React 19 + Tailwind 4 + Vite                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  AuthContext │  │  ChatContext │  │  UI Comp.    │   │
│  │ - JWT store  │  │ - Users list │  │ - SideBar    │   │
│  │ - axios inst.│  │ - Messages   │  │ - ChatCont.  │   │
│  │ - Socket life│  │ - Call state │  │ - RightSide  │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                  │           │
│         └────────┬────────┴──────────────────┘           │
│                  │                                       │
│           Axios (REST)  +  Socket.IO Client             │
└──────────────────┬──────────────────┬───────────────────┘
                   │                  │
                   ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                   Express 5 Server                      │
│  ┌────────────────┐ ┌─────────────────┐ ┌────────────┐  │
│  │  /api/auth     │ │  /api/messages  │ │ /api/calls │  │
│  │  - signup      │ │  - GET users    │ │ - history  │  │
│  │  - login       │ │  - GET thread   │ │ - record   │  │
│  │  - check       │ │  - POST send    │ └─────┬──────┘  │
│  │  - update-prof │ │  - PUT mark-seen│       │         │
│  └───────┬────────┘ └────────┬────────┘       │         │
│          │                   │                │         │
│          └───────┬───────────┴────────────────┘         │
│                  │  protectRoute middleware (JWT)       │
│                  │                                       │
│  ┌───────────────┴─────────────────────────────────┐    │
│  │         Socket.IO (same HTTP server)             │    │
│  │  - presence / messages / typing / read-status    │    │
│  │  - WebRTC signaling (offer/answer/ICE/end)       │    │
│  └───────────────────────┬──────────────────────────┘    │
└──────────────────────────┼───────────────────────────────┘
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
       ┌──────────┐  ┌──────────┐  ┌────────────┐
       │ MongoDB  │  │Cloudinary│  │ WebRTC P2P │
       │ (Mongoose)│ │  Images  │  │  Audio     │
       └──────────┘  └──────────┘  └────────────┘
          Peer A ───────────────────────── Peer B
               (audio never touches the server)
```

---

## Project Structure

```
Quick-Chat/
│
├── client/                              # React + Vite Frontend
│   ├── context/
│   │   ├── AuthContext.jsx              # Auth state, axios, socket lifecycle
│   │   └── ChatContext.jsx              # Users, messages, selection, call state
│   ├── public/
│   ├── src/
│   │   ├── assets/                      # Images, icons, SVGs
│   │   ├── components/
│   │   │   ├── SideBar.jsx              # User list / conversations
│   │   │   ├── ChatContainer.jsx        # Message thread + input + call UI
│   │   │   └── RightSidebar.jsx         # Contact info, media, call history
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx            # Signup + login
│   │   │   ├── HomePage.jsx             # Main chat layout
│   │   │   └── ProfilePage.jsx          # Profile editor
│   │   ├── App.jsx                      # Router setup
│   │   ├── index.css                    # Tailwind + theme
│   │   └── main.jsx                     # React entry
│   ├── .env                             # VITE_BACKEND_URL
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                              # Express + MongoDB + Socket.IO Backend
│   ├── controllers/
│   │   ├── userController.js            # Auth signup/login, profile update
│   │   ├── messageController.js         # Users list, thread, send, mark-seen
│   │   └── callController.js            # Call history endpoints
│   ├── lib/
│   │   ├── cloudinary.js                # Cloudinary client + upload helper
│   │   ├── db.js                        # MongoDB connection via Mongoose
│   │   └── utils.js                     # Token helpers
│   ├── middleware/
│   │   └── auth.js                      # JWT protectRoute middleware
│   ├── models/
│   │   ├── Call.js                      # Call records schema
│   │   ├── Message.js                   # Messages schema
│   │   └── User.js                      # Users schema
│   ├── routes/
│   │   ├── callRoutes.js                # /api/calls/*
│   │   ├── messageRoutes.js             # /api/messages/*
│   │   └── userRoutes.js                # /api/auth/*
│   ├── .env                             # PORT, MONGO, JWT, CLOUDINARY
│   ├── .gitignore
│   ├── package.json
│   └── server.js                        # Express + HTTP + Socket.IO entrypoint
│
└── README.md                            # YOU ARE HERE
```

---

## Prerequisites

| Tool | Minimum Version |
| --- | --- |
| **Node.js** | 18+ |
| **MongoDB** | Local MongoDB instance OR MongoDB Atlas cluster |
| **Cloudinary** | Free Cloudinary account (for profile & chat image uploads) |
| **npm** | Bundled with Node.js |
| Browser | Chrome / Edge / Firefox / Safari (modern, for WebRTC + ES modules) |

---

## Environment Setup

Create two `.env` files — **one inside `server/`, one inside `client/`**.

### 🔧 `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

| Variable | Description |
| --- | --- |
| `PORT` | Port for the Express + Socket.IO server (default `5000`) |
| `MONGO_URI` | MongoDB connection string (local: `mongodb://localhost:27017/quickchat` or Atlas SRV) |
| `JWT_SECRET` | Long random string used to sign JSON Web Tokens |
| `CLOUDINARY_*` | Cloudinary credentials — get them from your Cloudinary dashboard |

### 🎨 `client/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Base URL of the Express/Socket.IO server (no trailing slash) |

---

## Installation & Running

Open **two terminals** side-by-side from the `Quick-Chat/` project root.

### Terminal 1 — Start the Server

```bash
cd server
npm install          # first time only
npm start
```

Server runs at `http://localhost:5000` (with nodemon auto-reload).

### Terminal 2 — Start the Client

```bash
cd client
npm install          # first time only
npm run dev
```

Client runs at `http://localhost:5173` (Vite dev server with HMR).

Open `http://localhost:5173` in your browser to use the app.

---

## Standard Flow — How the App Works

### 1️⃣ User Signup / Login → Auth Flow
```
Browser                              Express Server                       MongoDB
   │                                      │                                   │
   │  POST /api/auth/signup               │                                   │
   │  { fullName, username, password,     │                                   │
   │    gender, profilePic? }             │                                   │
   │─────────────────────────────────────▶│                                   │
   │                                      │ bcrypt.hash(password)             │
   │                                      │ upload profilePic → Cloudinary    │
   │                                      │ create User document ────────────▶│
   │                                      │ create JWT (userId)               │
   │  201 { user, token } ◀──────────────│                                   │
   │                                      │                                   │
   │ store token in AuthContext           │                                   │
   │ attach "token" header on axios       │                                   │
   │ connect Socket.IO with userId        │                                   │
```

### 2️⃣ Loading the Chat Home → Contacts & Thread Flow
```
User lands on / (HomePage)
  │
  ├─ AuthContext auto-validates token via GET /api/auth/check
  │    (applies protectRoute middleware → reads userId from JWT)
  │
  ├─ ChatContext loads:
  │    ├─ GET /api/messages/users
  │    │     → all users except requester + unseen count per user
  │    │     → sorted: recent conversations first
  │    │
  │    └─ when a user is selected:
  │         ├─ GET /api/messages/:userId
  │         │    → thread array between viewer & userId
  │         │    → SIDE EFFECT: marks inbound messages from userId as seen
  │         │
  │         ├─ GET /api/calls/:userId
  │         │    → call history (missed/completed + duration + date)
  │         │
  │         └─ collect all image messages → media gallery (RightSidebar)
```

### 3️⃣ Sending a Message → Real-Time Flow
```
Sender Browser                       Socket.IO Server                    Receiver Browser
   │                                      │ userSocketMap                   │
   │  socket.emit("newMessage",           │                                 │
   │    { receiverId, message, image? })  │                                 │
   │─────────────────────────────────────▶│                                 │
   │                                      │ save Message doc ───────▶ MongoDB│
   │                                      │ emit("getMessage") ────────────▶│
   │                                      │ update unseen count             │
   │                                      │ broadcast typing=false          │
   │  ✅ message added to ChatContext     │                                 │  ✅ new message renders
   │                                      │                                 │  🔴 unseen badge updates
```

### 4️⃣ WebRTC Audio Call → Signaling + P2P Flow
```
 Caller Browser                    Socket.IO Server                 Callee Browser
      │  getUserMedia(mic)              │                                 │
      │  create RTCPeerConnection       │                                 │
      │  createOffer() → SDP offer      │                                 │
      │  socket.emit("call:offer",      │                                 │
      │    { calleeId, offer })         │                                 │
      │────────────────────────────────▶│ socket.emit("incomingCall") ────▶│
      │                                 │                                 │ show incoming-call UI +
      │                                 │                                 │ browser notification
      │                                 │  (if callee accepts...)         │
      │                                 │ socket.emit("call:answer") ────▶│
      │  setRemoteDescription(answer) ◀─│                                 │ createAnswer → accept
      │                                 │                                 │ getUserMedia(mic)
      │  ◀───── ICE candidates ──── exchange via ────▶ ICE candidates ──▶│
      │                                 │  call:icecandidate events       │
      │                                 │                                 │
      │ ◄══════════════════════ P2P AUDIO STREAM ══════════════════════════►│
      │        (WebRTC peer-to-peer — AUDIO NEVER TOUCHES SERVER)          │
      │                                 │                                 │
      │  (call ends)                     │                                 │
      │  socket.emit("call:end") ───────▶│                                 │
      │                                 │ POST /api/calls/:userId         │
      │                                 │  → save Call record to MongoDB  │
      │                                 │ socket.emit("call:ended") ──────▶│
      │  call history updates ◀─────────│────────────────────────────────▶│ call history updates
```

### 5️⃣ Read Receipts & Typing → Presence Flow
```
┌─────────────────────────┐     Socket.IO Server      ┌─────────────────────────┐
│       Typing User       │                            │       Viewing User      │
└────────────┬────────────┘                            └────────────┬────────────┘
             │  typing=true (debounced)                            │
             │────────────────────────────────────────────────────▶│ ⌨️ "is typing..."
             │                                                      │
             │  typing=false                                        │
             │────────────────────────────────────────────────────▶│ indicator cleared
             │                                                      │
             │  markAsSeen (whole thread)                           │
             │────────────────────────────────────────────────────▶│ ✅ seen ticks appear
             │                                                      │
┌────────────┴────────────┐                            ┌────────────┴────────────┐
│ Socket: connect/disconn.│  emits getOnlineUsers →   │ Online dot (🟢 / ⚫)    │
└─────────────────────────┘                            └─────────────────────────┘
```

---

## Available Scripts

### Client (`cd client`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start **Vite** dev server → `http://localhost:5173` with HMR |
| `npm run build` | Create optimized **production build** in `dist/` |
| `npm run preview` | Serve the built `dist/` folder locally for QA |
| `npm run lint` | Run **ESLint** 9 with React + React-Hooks + Refresh rules |

### Server (`cd server`)

| Command | Description |
| --- | --- |
| `npm start` | Start **Express + Socket.IO** via **nodemon** → `http://localhost:5000` (auto-reloads on file changes) |

---

## REST API Reference

All protected routes read the JWT from the **`token`** request header (set automatically by the client axios instance from AuthContext).

### Authentication — `/api/auth`

| Method | Route | Auth | Description | Request Body | Response |
| --- | --- | --- | --- | --- | --- |
| `POST` | `/signup` | Public | Register a new user and issue a JWT | `{ fullName, username, password, gender, profilePic? }` (multipart if profilePic) | `{ user, token }` |
| `POST` | `/login` | Public | Authenticate existing user and issue JWT | `{ username, password }` | `{ user, token }` |
| `GET`  | `/check` | Protected | Validate token & return current user | — (header only) | `{ user }` |
| `PUT`  | `/update-profile` | Protected | Update current user's profile (name/bio/picture) | Multipart: `{ fullName?, bio?, profilePic? }` | `{ user }` |

### Messages — `/api/messages`

| Method | Route | Auth | Description | Request Body |
| --- | --- | --- | --- | --- |
| `GET`  | `/users` | Protected | List all users (excluding requester) with unseen message counts, recent conversations first | — |
| `GET`  | `/:id` | Protected | Fetch message thread between requester and `:id`; **side effect**: marks inbound messages from `:id` as seen | — |
| `POST` | `/send/:id` | Protected | Send a text or image message to user `:id` (image uploaded through Cloudinary) | `{ message?, image? }` (multipart if image) |
| `PUT`  | `/mark/:id` | Protected | Mark inbound messages from user `:id` as seen | `{ messageId? }` (optional: single msg ID) |

### Calls — `/api/calls`

| Method | Route | Auth | Description | Request Body |
| --- | --- | --- | --- | --- |
| `GET`  | `/:userId` | Protected | Retrieve call history between requester and `:userId` (newest first) | — |
| `POST` | `/:userId` | Protected | Record a completed/missed/cancelled call entry | `{ status, duration, startedAt, endedAt }` |

---

## Socket.IO Real-Time Events

The Socket.IO server runs on the **same HTTP server** as Express (same port). Clients connect with their `userId` in the handshake so the server can maintain the `userSocketMap` (`socket.id ↔ userId`).

### Client → Server

| Event | Payload | Effect |
| --- | --- | --- |
| `newMessage` | `{ receiverId, message?, image? }` | Saves Message to DB; emits `getMessage` to receiver; updates online user presence broadcast |
| `markAsSeen` | `{ senderId }` | Marks all inbound messages from `senderId` as seen; broadcasts `messagesSeen` event |
| `typing` | `{ receiverId, isTyping }` | Forwards `typing` event to the receiver socket |
| `call:offer` | `{ calleeId, offer }` | Triggers `incomingCall` event on the callee's socket (starts WebRTC negotiation) |
| `call:answer` | `{ callerId, answer }` | Forwards the SDP answer back to the caller |
| `call:icecandidate` | `{ targetId, candidate }` | Relays ICE candidates between peers during P2P establishment |
| `call:end` | `{ peerId, callData }` | Informs the peer, persists the call record via the Call controller |

### Server → Client

| Event | Payload |
| --- | --- |
| `getOnlineUsers` | `Array<{ userId, online: boolean }>` — broadcast on connect / disconnect |
| `getMessage` | new **Message** document (for the receiver) |
| `messagesSeen` | `{ senderId }` — tells the sender their message was viewed |
| `typing` | `{ senderId, isTyping: boolean }` — typing indicator |
| `incomingCall` | `{ caller, offer }` — incoming call prompt UI |
| `call:answer` | SDP answer from the callee → caller |
| `call:icecandidate` | Remote ICE candidate → add to peer connection |
| `call:ended` | `{ callRecord }` — both sides update call history UI |

---

## Database Models

Schemas are defined with **Mongoose 8** inside `server/models/`.

### 👤 User (`User.js`)

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `fullName` | `String` | ✅ | User's display name |
| `username` | `String` | ✅ **unique** | Login username |
| `password` | `String` | ✅ | Stored bcrypt-hashed (never plaintext) |
| `gender` | `String` | ✅ | Enum: `male` / `female` / `other` |
| `profilePic` | `String` | ❌ | Cloudinary secure URL |
| `bio` | `String` | ❌ max 500 chars | Short status / bio |
| `createdAt` | `Date` | auto | `timestamps: true` |
| `updatedAt` | `Date` | auto | `timestamps: true` |

### 💬 Message (`Message.js`)

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `senderId` | `ObjectId → User` | ✅ | Ref to User |
| `receiverId` | `ObjectId → User` | ✅ | Ref to User |
| `message` | `String` | ❌ | Text content |
| `image` | `String` | ❌ | Cloudinary secure URL (if image was sent) |
| `seen` | `Boolean` | ✅ default `false` | Read receipt flag |
| `createdAt` | `Date` | auto | `timestamps: true` |
| `updatedAt` | `Date` | auto | `timestamps: true` |

> Either `message` or `image` (or both) must be present on a Message document.

### 📞 Call (`Call.js`)

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `callerId` | `ObjectId → User` | ✅ | User who initiated the call |
| `receiverId` | `ObjectId → User` | ✅ | User who was called |
| `status` | `String` | ✅ | Enum: `completed` / `missed` / `cancelled` |
| `duration` | `Number` (seconds) | default `0` | Total call duration (for completed calls) |
| `startedAt` | `Date` | ✅ | When call was initiated |
| `endedAt` | `Date` | ❌ | When call ended |
| `createdAt` | `Date` | auto | `timestamps: true` |

---

## Deployment Notes

### Before going live

1. **CORS**: Restrict `CORS_ORIGIN` on the server to **only your deployed client URL** (never `*` in production).
2. **HTTPS**: Deploy both client and server over **HTTPS**.
   - The browser will **deny microphone access** (`getUserMedia`) on insecure origins, which means audio calls will only work on `localhost` or `https://` URLs.
3. **Environment variables**: Keep `.env` files out of version control (they are already `.gitignore`d). Use your hosting platform's secrets/environment management instead (Vercel env vars, Render env, etc.).
4. **MongoDB**: Use **MongoDB Atlas** in production (or a managed MongoDB). Don't expose a local MongoDB instance directly to the web.
5. **WebRTC / TURN**: For reliable audio calls across restrictive corporate NATs/firewalls, add a **TURN server** to the WebRTC ICE servers list on the client. (Public STUN works for ~80% of networks; a TURN service covers the rest.) Options: Twilio NTS, Coturn (self-hosted), OpenRelay, etc.
6. **Rate limiting**: Add rate limiting middleware (e.g. `express-rate-limit`) to auth endpoints (signup/login) and message-send endpoints to prevent abuse.
7. **Build the client**: Run `npm run build` in `client/` and deploy the generated `dist/` folder to any static host (Vercel, Netlify, S3+CloudFront, etc.).
8. **Server hosting**: Deploy the `server/` folder to any Node.js host (Render, Railway, Fly.io, DigitalOcean, AWS EC2, etc.). Make sure the host supports **long-lived WebSocket connections**.

### Quick production build checklist

```bash
# Client — build static assets
cd client
npm install
npm run build     # → dist/ folder, deploy this

# Server — runs with node (or pm2 in production)
cd server
npm install
NODE_ENV=production node server.js     # or keep using npm start with nodemon in dev only
```

---

## Development & Contributing Notes

- **Dependencies are isolated**: always run `npm install` inside `client/` and `server/` separately. Do not add a `package.json` at the project root (unless intentionally adding a monorepo manager later).
- Never commit `.env` files. Each developer creates their own based on the template above.
- The client uses **Tailwind CSS 4 via the Vite plugin** — there is no `tailwind.config.js`; theme tokens live inside `@theme` blocks in CSS.
- Socket.IO is authenticated: always pass the current user id when connecting so the server can build the presence map correctly.
- WebRTC call audio is peer-to-peer — the server only exchanges signaling metadata. Call **data** (record) is saved to the database on hangup.
