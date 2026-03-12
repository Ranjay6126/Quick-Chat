Quick-Chat

Quick-Chat is a real-time messaging application built with the MERN stack and Socket.io. It enables instant, bidirectional communication between users with secure authentication, live online presence tracking, media sharing, and a responsive interface.

The project is structured into two separate packages:

client – React + Vite frontend

server – Express + MongoDB + Socket.io backend

Features

Real-time messaging using Socket.io (WebSockets)

Secure JWT authentication (Signup, Login, Token validation)

Protected API routes with middleware

Online/offline user presence tracking

Unseen message counts and read receipts

Live typing indicators and instant message updates

Image uploads via Cloudinary (profile & chat images)

Responsive UI with TailwindCSS

Clean state management using Auth and Chat Contexts

Tech Stack
Frontend

React+Vite

TailwindCSS 4

React Router 7

Axios

socket.io-client

Backend

Node.js

Express 5

MongoDB

Mongoose 8

Socket.io 4

JSON Web Tokens (JWT)

bcryptjs

Cloudinary

Tooling

ESLint 9

Nodemon

dotenv

CORS

Architecture
Client

AuthContext – Handles authentication, token storage, axios setup, and socket lifecycle.

ChatContext – Manages users, selected chats, and messages.

Route guards for private and public pages.

Components include chat viewport, sidebar, and media preview panel.

Server

server.js – Express + HTTP + Socket.io setup

Routes:

/api/auth

/api/messages

Middleware:

protectRoute (JWT verification)

Models:

User

Message

Controllers for authentication, messaging, and profile updates

API Overview
Auth Routes (/api/auth)

POST /signup – Register user

POST /login – Authenticate user and issue JWT

PUT /update-profile – Update profile details

GET /check – Validate token

Message Routes (/api/messages)

GET /users – Fetch users with unseen message counts

GET /:id – Get chat thread and mark messages as seen

POST /send/:id – Send message (text/image)

PUT /mark/:id – Mark message as seen

Socket Events

Client connects with userId in handshake query

Server maintains userSocketMap

Emits getOnlineUsers on connect and disconnect

Enables instant message broadcasting

Setup & Installation
Prerequisites

Node.js (LTS)

MongoDB (local or Atlas)

Cloudinary account

Backend Setup
cd server
npm install
npm start

Server runs on:
http://localhost:5000

Frontend Setup
cd client
npm install
npm run dev

Client runs on:
http://localhost:5173

Environment Variables
Server .env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
Client .env
VITE_BACKEND_URL=http://localhost:5000
Project Structure
Quick-Chat/
│
├── client/        # React frontend
├── server/        # Express backend
└── README.md
Development Notes

Install dependencies separately inside client/ and server/

Do not commit .env files

Keep JWT stored securely on the client

Avoid duplicate package.json files at the root

Highlights

Designed for scalability with support for high concurrent connections

Zero page reload real-time updates

Secure session handling with JWT

Optimized media storage using Cloudinary

Clean separation between authentication and chat logic
