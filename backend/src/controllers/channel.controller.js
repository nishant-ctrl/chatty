import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Channel } from "../models/channel.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const createChannel = asyncHandler(async (req, res) => {
    const { name, members } = req.body;
    if (!name) throw new ApiError(400, "Channel Name is required");

    const validMember = await User.find({ _id: { $in: members } });
    if (validMember.length !== members.length) {
        throw new ApiError(400, "Some members are not valid users.");
    }
    const newChannel = await Channel.create({
        name,
        members,
        admin: req.user._id,
    });
    // console.log(newChannel)
    if (!newChannel) throw new ApiError(500, "Error while creating channel");
    return res
        .status(200)
        .json(new ApiResponse(200, newChannel, "Channel created successfully"));
});

const getUserChannels = asyncHandler(async (req, res) => {
    const channels = await Channel.find({
        $or: [
            {
                admin: req.user._id,
            },
            {
                members: req.user._id,
            },
        ],
    }).sort({ updatedAt: -1 });
    console.log(channels)
    return res
        .status(200)
        .json(new ApiResponse(200, channels, "Fetched all channels"));
});

export { createChannel, getUserChannels };
