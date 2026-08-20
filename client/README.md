# Quick-Chat Client (React + Vite)

React frontend for the Quick Chat application. Built with Vite, React 19, Tailwind CSS 4, and Socket.IO Client.

## Stack

- **React 19** + **Rolldown-Vite** (dev server & build)
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **React Router 7** for navigation
- **Axios** for REST API calls
- **Socket.IO Client** for real-time messaging & WebRTC signaling
- **react-hot-toast** for notifications

## Scripts

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build into dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint with React & Hooks rules
```

## Environment

Create `.env` in this folder:

```env
VITE_BACKEND_URL=http://localhost:5000
```

All API calls and Socket.IO connections use this base URL. Make sure the server is running before starting the client.

## Project Layout

```
client/
├── context/
│   ├── AuthContext.jsx     # Auth state, axios interceptor, socket lifecycle
│   └── ChatContext.jsx     # Users, selected user, messages, call state
├── src/
│   ├── components/
│   │   ├── SideBar.jsx         # User list / conversations
│   │   ├── ChatContainer.jsx   # Message thread, typing, call UI
│   │   └── RightSidebar.jsx    # Contact info, media gallery, call history
│   ├── pages/
│   │   ├── LoginPage.jsx       # Signup + login forms
│   │   ├── HomePage.jsx        # Chat layout (sidebar + chat + right panel)
│   │   └── ProfilePage.jsx     # Profile editor
│   ├── lib/utils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css          # Tailwind directives + theme
├── vite.config.js
├── eslint.config.js
└── package.json
```

## Key Contexts

### AuthContext
- Stores the logged-in user and JWT token.
- Configures an axios instance that auto-attaches the token.
- Manages the global Socket.IO connection (connects on login, disconnects on logout).

### ChatContext
- Holds the list of contacts (with unread counts).
- Tracks the currently selected conversation.
- Manages the messages array for the active thread.
- Holds WebRTC / incoming-call UI state.

## Build Notes

- Tailwind 4 is used via the Vite plugin (no config file needed beyond the import in `index.css`).
- Rolldown-Vite is pinned as the Vite implementation via `package.json` `overrides`.
- Production assets are emitted to `dist/`; deploy that folder to any static host.

## Authentication Flow

1. User signs up or logs in via `/api/auth/signup` or `/api/auth/login`.
2. The server returns a JWT; the client stores it (via AuthContext) and attaches it as a `token` header on every subsequent axios call.
3. Socket.IO handshake also includes the user id so the server can map socket → user for online presence and signaling.
