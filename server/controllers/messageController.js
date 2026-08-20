import Message from "../models/Message.js"; 
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

import cloudinary from "../lib/cloudinary.js";
//Get all users except the logged in user

export const getUserForSidebar = async (req, res)=>{

    try {

        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count number of messages not seen

        const unseenMessages ={}
        const promise = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen:false})

             if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
             }
        })

        await Promise.all(promise);
        const usersWithRecency = await Promise.all(filteredUsers.map(async (user) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: userId, receiverId: user._id },
                    { senderId: user._id, receiverId: userId },
                ],
            }).sort({ createdAt: -1 }).select("createdAt");
            return { ...user.toObject(), lastMessageAt: lastMessage?.createdAt || user.createdAt };
        }));
        res.json({success:true, users: usersWithRecency, unseenMessages})

    }catch(error){

        console.log(error.message);
        res.json({success: false, message: error.message})

    }

}

//Get all message for the selected user
 export const getMessages = async (req, res) =>{
    try {
        const { id: selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or :[
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })
        const unreadMessages = await Message.find({ senderId: selectedUserId, receiverId: myId, seen: false }).select("_id");
        if (unreadMessages.length) {
            await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { seen: true });
            const senderSocketId = userSocketMap[selectedUserId];
            if (senderSocketId) io.to(senderSocketId).emit("messageSeen", { messageIds: unreadMessages.map((message) => message._id.toString()) });
        }

        res.json({success:true, messages})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
 }


 //api to mark message as seen using message id

export const markMessageAsSeen = async(req, res)=>{

    try{
        const {id} = req.params;
        const message = await Message.findByIdAndUpdate(id, {seen:true}, {new: true})
        const senderSocketId = userSocketMap[message?.senderId?.toString()];
        if (senderSocketId) io.to(senderSocketId).emit("messageSeen", { messageIds: [id] });
        
        res.json({success: true})


    }catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
 }

// Edit a text message sent by the authenticated user
export const editMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const message = await Message.findOne({ _id: id, senderId: req.user._id });

        if (!message) return res.status(404).json({ success: false, message: "Message not found" });
        if (message.image) return res.status(400).json({ success: false, message: "Images cannot be edited" });
        if (!text?.trim()) return res.status(400).json({ success: false, message: "Message cannot be empty" });

        message.text = text.trim();
        await message.save();

        const receiverSocketId = userSocketMap[message.receiverId.toString()];
        if (receiverSocketId) io.to(receiverSocketId).emit("messageEdited", message);
        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


 //Send message to selected user

 export const sendMessage = async (req, res)=>{

    try {
        const {text, image} = req.body;

        const receiverId = req.params.id;

        const senderId = req.user._id;


        let imageUrl;
        if(image){

            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;

        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text, 
            image: imageUrl
        })

        //Emit the new message to the receiver's socket

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({success: true, newMessage});


    }catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
 }


