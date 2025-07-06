import { Server as SocketIOServer } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import { Messages } from "./src/models/messages.model.js";
import {Channel} from "./src/models/channel.model.js"
const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    io.use((socket, next) => {
        const cookieHeader = socket.handshake.headers.cookie;

        if (!cookieHeader) {
            console.log("❌ No cookie found in handshake");
            return next(new Error("Authentication error"));
        }

        const cookies = cookie.parse(cookieHeader);
        const token = cookies.accessToken;

        if (!token) {
            console.log("❌ No token in cookie");
            return next(new Error("Authentication error"));
        }

        try {
            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            );
            socket.userId = decodedToken._id;
            return next();
        } catch (err) {
            console.log("❌ Invalid token", err.message);
            return next(new Error("Authentication error"));
        }
    });

    const disconnect = (socket) => {
        console.log(`Client Disconnect: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        const messageData = new Messages(message); // create instance
        await messageData.save();
        await messageData.populate([
            {
                path: "sender",
                select: "id email firstName lastName image color",
            },
            {
                path: "recipient",
                select: "id email firstName lastName image color",
            },
        ]);
        if (recipientSocketId) {
            // console.log("Sent to recipient")
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }
        if (senderSocketId) {
            // console.log("Sent to sender")
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    };
    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl, fileName } =
            message;
        const createdMessage = await Messages.create({
            sender,
            recipient: null,
            content,
            messageType,
            fileUrl,
            fileName,
        });
        const messageData = await Messages.findById(createdMessage._id)
            .populate("sender", "id firstName lastName image color")
            .exec();
        await Channel.findByIdAndUpdate(channelId,{
            $push:{
                messages:createdMessage._id,
            }
        })  
        const channel=await Channel.findById(channelId).populate("members")
        const finalData = {...messageData._doc,channelId:channel._id}
        if(channel && channel.members){
            channel.members.forEach((member)=>{
                const memberSocketId=userSocketMap.get(member._id.toString())
                if(memberSocketId){
                    io.to(memberSocketId).emit(
                        "recieveChannelMessage",
                        finalData
                    );
                }
            })
            const adminSocketId=userSocketMap.get(channel.admin._id.toString())
            if (adminSocketId) {
                io.to(adminSocketId).emit(
                    "recieveChannelMessage",
                    finalData
                );
            }
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} (socket ID: ${socket.id})`);
        } else {
            console.log("No valid user ID from cookie");
        }

        socket.on("sendMessage", sendMessage);
        socket.on("sendChannelMessage", sendChannelMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
