import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Messages",
                required: false,
            },
        ],
    },
    { timestamps: true }
);

export const Channel = mongoose.model("Channel", channelSchema);
