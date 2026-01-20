# Quick-Chat

Quick-Chat is a real-time chat application built with the MERN stack and Socket.io. It enables instant messaging between users, real-time online presence, secure JWT authentication, media sharing, and a responsive interface. The project is split into two packages: `client` (React + Vite) and `server` (Express + MongoDB + Socket.io).

## Features
- Real-time messaging with WebSockets (Socket.io)
- JWT-based authentication and protected API routes
- Online presence tracking and broadcast
- Image/media support via Cloudinary (profile and message images)
- Responsive UI with TailwindCSS and React Router
- Unseen message counts and read receipts (seen flag)
- Clean separation of concerns via Auth and Chat contexts

## Tech Stack
- Client: React 19, Vite, TailwindCSS 4, React Router 7, axios, socket.io-client
- Server: Express 5, Socket.io 4, Mongoose 8, JSON Web Tokens, bcryptjs, Cloudinary
- Tooling: ESLint 9, nodemon, dotenv, CORS

## Architecture
- Client
  - Global providers: `AuthContext` (auth, axios, socket lifecycle), `ChatContext` (users, messages, selection)
  - Routing guards: private/public routes for Home, Login, Profile
  - Components: chat viewport, sidebar, right sidebar (media)
- Server
  - `server.js`: Express + HTTP + Socket.io setup, payload limits, CORS
  - Routers: `/api/auth` and `/api/messages`
  - Middleware: JWT protectRoute
  - Controllers: users, messages, profile, auth check
  - Models: `User`, `Message`

## Setup
1. Prerequisites: Node.js LTS, MongoDB (Atlas or local), Cloudinary account
2. Environment variables:
   - Server `.env`:
     - `PORT=5000`
     - `MONGO_URI=<your-mongodb-uri>`
     - `JWT_SECRET=<your-jwt-secret>`
     - `CLOUDINARY_CLOUD_NAME=<cloud-name>`
     - `CLOUDINARY_API_KEY=<api-key>`
     - `CLOUDINARY_API_SECRET=<api-secret>`
   - Client `.env`:
     - `VITE_BACKEND_URL=http://localhost:5000`
3. Install dependencies:
   - From `server/`: `npm install`
   - From `client/`: `npm install`
4. Run:
   - Server: `npm start` (nodemon)
   - Client: `npm run dev` (Vite)

## Scripts
- Client
  - `dev`: start Vite dev server
  - `build`: production build
  - `preview`: preview built assets
  - `lint`: run ESLint
- Server
  - `start`: run nodemon server

## API Overview
- Auth (`/api/auth`)
  - `POST /signup`, `POST /login`: issue JWT
  - `PUT /update-profile`: update name/bio/profilePic (Cloudinary)
  - `GET /check`: validate token and return user
- Messages (`/api/messages`)
  - `GET /users`: list users excluding requester + unseen counts
  - `GET /:id`: thread between requester and `:id` + mark inbound as seen
  - `POST /send/:id`: send message (text/image)
  - `PUT /mark/:id`: mark a message as seen

## Socket Events
- Client connects with `userId` in the handshake query
- Server maintains `userSocketMap` and emits `getOnlineUsers` on connect/disconnect

## Folder Structure
```
Quick-Chat/
  client/          # React app
  server/          # Express/Socket.io API
  README.md        # Project documentation (this file)
```

## Development Notes
- Keep dependencies isolated: install in `client/` and `server/` only
- Do not keep duplicate package.json or lockfiles at the project root
- Ignore secrets: never commit `.env` files
- Use JWT from client via `Authorization: Bearer <token>` or `token` header

## License
Proprietary. All rights reserved.
