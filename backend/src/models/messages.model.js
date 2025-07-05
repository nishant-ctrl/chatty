import mongoose from "mongoose";
import { Schema } from "mongoose";

const messagesSchema = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        messageType: {
            type: String,
            enum: ["text", "file"],
            required: true,
        },
        content: {
            type: String,
            required: function () {
                return this.messageType === "text";
            },
        },
        fileUrl: {
            type: String,
            required: function () {
                return this.messageType === "file";
            },
        },
        fileName: {
            type: String,
            required: function () {
                return this.messageType === "file";
            },
        },
    },
    { timestamps: true }
);

export const Messages = mongoose.model("Messages", messagesSchema);
