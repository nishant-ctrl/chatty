import { Server as SocketIOServer } from "socket.io";
import cookie from "cookie"
import jwt from "jsonwebtoken";

import {Messages} from "./src/models/messages.model.js"

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

    const sendMessage=async (message)=>{
        const senderSocketId=userSocketMap.get(message.sender)
        const recipientSocketId=userSocketMap.get(message.recipient)
        // const createdMessage=await Messages.create(message);
        // const messageData = await Messages.findById(createdMessage._id)
        //     .populate("sender", "id email firstName lastName image color")
        //     .populate("recipient", "id email firstName lastName image color");
        const messageData = new Messages(message); // create instance
        await messageData.save(); // save to DB

        // populate sender and recipient in the same instance
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
        if(recipientSocketId){
            // console.log("Sent to recipient")
            io.to(recipientSocketId).emit("recieveMessage",messageData)
        }
        if(senderSocketId){
            // console.log("Sent to sender")
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    }




    // io.on("connection", (socket) => {
    //     const userId = socket.handshake.query.userId;
    //     if (userId) {
    //         userSocketMap.set(userId, socket.id);
    //         console.log(
    //             `User connected: ${userId} with socket ID: ${socket.id}`
    //         );
    //     } else {
    //         console.log("User ID not provided during connection.");
    //     }

    //     socket.on("disconnect", () => disconnect(socket));
    // });
    io.on("connection", (socket) => {
        const userId = socket.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} (socket ID: ${socket.id})`);
        } else {
            console.log("No valid user ID from cookie");
        }

        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
