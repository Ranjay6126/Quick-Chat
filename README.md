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
│   ├── controllers/        # Auth, messaging, call business logic
│   ├── models/             # User, Message, and Call models
│   ├── middleware/         # JWT protectRoute
│   ├── lib/                # DB, Cloudinary, utils
│   └── routes/             # /api/auth, /api/messages, /api/calls
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
MONGO_URI=your_mongodb_connection_string   # e.g. mongodb://localhost:27017/quickchat or Atlas SRV
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

---

## How it works (high-level flow)

1. **Auth** — User signs up / logs in → server issues a JWT → client stores it and sends it via the `token` header on every API request; Socket.IO also authenticates with the user id so the server knows who's online.
2. **Chat** — User picks a contact → loads the message thread + call history → sends text/images via Socket.IO `newMessage` event → server saves to MongoDB and broadcasts to the receiver.
3. **Read receipts & typing** — Socket.IO forwards `typing` and `markAsSeen` events between peers in real time.
4. **Audio call** — Caller creates a WebRTC offer → Socket.IO relays it as `incomingCall` → callee answers → ICE candidates exchanged → **peer-to-peer audio stream starts directly between browsers** (audio never touches the server) → on hangup the call record is saved to the DB.

---

## Available scripts

| Location | Command | Description |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Create a production build |
| `client` | `npm run preview` | Preview the production build locally |
| `client` | `npm run lint` | Run ESLint |
| `server` | `npm start` | Start the API with nodemon (auto-reloads) |

## API overview

| Route | Purpose | Auth |
| --- | --- | --- |
| `/api/auth/signup` · `POST` | Register a new user, return JWT | Public |
| `/api/auth/login` · `POST` | Authenticate, return JWT | Public |
| `/api/auth/check` · `GET` | Validate token and return user | Protected |
| `/api/auth/update-profile` · `PUT` | Update name / bio / profile pic (Cloudinary) | Protected |
| `/api/messages/users` · `GET` | List contacts with unseen counts (recent first) | Protected |
| `/api/messages/:id` · `GET` | Thread between requester and `:id` (marks inbound as seen) | Protected |
| `/api/messages/send/:id` · `POST` | Send text or image message | Protected |
| `/api/messages/mark/:id` · `PUT` | Mark messages from `:id` as seen | Protected |
| `/api/calls/:userId` · `GET` | Call history for a conversation | Protected |
| `/api/calls/:userId` · `POST` | Record a completed / missed / cancelled call | Protected |

## Real-time events

Socket.IO provides online presence, incoming messages, typing activity, message-read updates, and WebRTC call signaling. Audio media is sent directly between the two browsers; Socket.IO only exchanges the information needed to establish the connection.

> Audio calls require microphone permission and a secure context in production (HTTPS). For reliable calls across restrictive networks, add a TURN server to the WebRTC ICE configuration.

## Development status

The core chat, read receipts, typing status, image sharing, online presence, audio calls, and call history are implemented. Before production deployment:

- Restrict CORS origins (never use `*`)
- Add a TURN service for reliable WebRTC
- Add rate limiting on auth and message-send endpoints
- Use HTTPS end-to-end
- Keep all environment secrets outside version control
