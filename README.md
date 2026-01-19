# Quick-Chat
Quick Chat is a real-time chat application built using the MERN stack and Socket.io. It allows users to send and receive instant messages with live updates, ensuring smooth and fast communication between multiple users. The app includes secure user authentication, chat rooms, and responsive UI for seamless use across devices.

Tech Stack
Frontend: React, Tailwind CSS, Chart.js, Axios.
Backend: Node.js, Express, MongoDB, Mongoose, JWT.

Prerequisites
Node.js installed.
MongoDB installed and running locally on mongodb://localhost:27017. Or you can use online mongo Db atas. 

•	Designed a real-time chat application using WebSocket.io, enabling instant, bidirectional communication between client and server with support for 900+ concurrent connections and zero-delay message delivery.
•	Executed secure user authentication with JWT, including login, signup, protected routes, token validation, and session handling for a fully authenticated messaging experience.
•	Created chat features such as active/online user status, read receipts (seen & unseen), live typing indicators, instant message updates without page reload, and real-time notifications.
•	Integrated media uploads with Cloudinary for image storage and optimization, with MongoDB used
 to store user profile details and media metadata efficiently.

 Setup & Installation
1. Backend
cd server
npm install
# Start the server
npm start
# Server runs on http://localhost:5000


cd client
npm install
# Start the client
npm run dev
# Client runs on http://localhost:5173


server/: Backend API and Database Logic.
client/: Frontend React Application.
server/uploads/: Stores attendance images locally.

