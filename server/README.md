# Quick-Chat Server (Express + MongoDB + Socket.IO)

Backend API and real-time Socket.IO server for the Quick Chat application.

## Stack

- **Node.js** + **Express 5** (REST API)
- **MongoDB** with **Mongoose 8** (ODM)
- **Socket.IO 4** (real-time messaging & WebRTC signaling)
- **JSON Web Tokens** (authentication)
- **bcryptjs** (password hashing)
- **Cloudinary** (image storage for profiles & messages)
- **nodemon** (dev auto-reload)

## Scripts

```bash
npm start   # Start server with nodemon on http://localhost:5000
```

## Environment

Create `.env` in this folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Project Layout

```
server/
├── controllers/
│   ├── userController.js       # Auth signup/login, profile updates
│   ├── messageController.js    # Contacts list, thread fetching, sending messages
│   └── callController.js       # Call history endpoints
├── models/
│   ├── User.js                 # Users collection schema
│   ├── Message.js              # Messages collection schema
│   └── Call.js                 # Calls collection schema
├── routes/
│   ├── userRoutes.js           # /api/auth/*
│   ├── messageRoutes.js        # /api/messages/*
│   └── callRoutes.js           # /api/calls/*
├── middleware/
│   └── auth.js                 # JWT protectRoute middleware
├── lib/
│   ├── db.js                   # MongoDB connection
│   ├── cloudinary.js           # Cloudinary client + upload helper
│   └── utils.js                # Token helpers, utilities
├── server.js                   # Express + HTTP + Socket.IO entrypoint
└── package.json
```

## API Endpoints

All protected routes expect a JWT via the `token` request header (sent as a custom header by the client axios instance).

### Auth — `/api/auth`

| Method | Route | Description | Body |
| --- | --- | --- | --- |
| `POST` | `/signup` | Register a new user, return JWT | `{ fullName, username, password, gender, profilePic? }` |
| `POST` | `/login` | Authenticate existing user, return JWT | `{ username, password }` |
| `GET`  | `/check` | Validate token and return current user | — (header only) |
| `PUT`  | `/update-profile` | Update name/bio/profile picture (Cloudinary upload) | Multipart: `{ fullName?, bio?, profilePic? }` |

### Messages — `/api/messages`

| Method | Route | Description | Body |
| --- | --- | --- | --- |
| `GET`  | `/users` | List users (excluding requester) with unseen message counts | — |
| `GET`  | `/:id` | Fetch message thread between requester and `:id`; mark inbound as seen | — |
| `POST` | `/send/:id` | Send a message (text or image via Cloudinary) to user `:id` | `{ message?, image? }` |
| `PUT`  | `/mark/:id` | Mark a message or whole thread as seen | `{ messageId? }` |

### Calls — `/api/calls`

| Method | Route | Description |
| --- | --- | --- |
| `GET`  | `/:userId` | Retrieve call history between the requester and `:userId` |
| `POST` | `/:userId` | Record a completed call entry |

## Socket.IO Events

The Socket.IO server runs on the same HTTP server as Express. Clients connect with `userId` in the handshake auth/query so the server can maintain a `userSocketMap` (socket.id ↔ userId).

### From Client → Server

| Event | Payload | Effect |
| --- | --- | --- |
| `newMessage` | `{ receiverId, ...message }` | Validates auth, saves to DB, emits `getMessage` to receiver, emits `getOnlineUsers` update |
| `markAsSeen` | `{ senderId }` | Marks inbound messages from `senderId` as seen, broadcasts `messagesSeen` |
| `typing` | `{ receiverId, isTyping }` | Forwards `typing` event to receiver |
| `call:*` | various | WebRTC signaling: offer, answer, ICE candidates, call start/end |

### From Server → Client

| Event | Payload |
| --- | --- |
| `getOnlineUsers` | array of `{ userId, online }` |
| `getMessage` | new incoming message object |
| `messagesSeen` | `{ senderId }` |
| `typing` | `{ senderId, isTyping }` |
| `incomingCall` | caller info + WebRTC offer |
| `callAccepted` / `callEnded` / `iceCandidate` | WebRTC lifecycle events |

## Authentication & Middleware

- `protectRoute` middleware (in `middleware/auth.js`) is applied to all message and call routes, and to the profile update endpoint.
- It reads the JWT from the `token` header, verifies it, and attaches `req.user` for downstream controllers.
- Socket connections are also authenticated against the same JWT before joining the `userSocketMap`.

## Database Models

- **User** — `fullName`, `username` (unique), `password` (hashed), `gender`, `profilePic`, `bio`, timestamps.
- **Message** — `senderId`, `receiverId`, `message` (text), `image` (Cloudinary URL), `seen` (boolean), timestamps.
- **Call** — `callerId`, `receiverId`, `status` (`missed` / `completed` / `cancelled`), `duration` (seconds), `startedAt`, `endedAt`.

## Deployment Notes

- Set `PORT` to your host's expected port.
- Make `CORS_ORIGIN` configurable if deploying the client on a different domain.
- Use HTTPS in production; WebRTC audio requires a secure context for microphone access on the client.
- For reliable WebRTC audio across restrictive NATs/firewalls, add a TURN server to the client ICE servers list.
- Never commit `.env` — it is already gitignored.
