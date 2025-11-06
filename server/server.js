import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import {connectDB} from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";


// create express app and HTTP server

const app = express();
const server = http.createServer(app)

//Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

//Store online users
export const userSocketMap = {}; // {useId : socketId}

//Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.useId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId] = socket.id;

    // Emit online user to all connected Clients

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlieUsers", Object.keys(userSocketMap))
    })

})




// Middleware setup 
app.use(express.json({limit: "4mb"}));
app.use(cors());

//route setup
app.use("/api/status", (req,res)=> res.send("Server is Live"));

app.use("/api/auth", userRouter);

app.use("/api/messages", messageRouter)

//connect to MongoDB

await connectDB();  

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("Sever is running on PORT:"+ PORT));


