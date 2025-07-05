import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Messages } from "../models/messages.model.js";

function sanitizeSearchTerm(term) {
    if (typeof term !== "string") return "";

    return term
        .trim() // remove leading/trailing whitespace
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape regex special characters
        .replace(/\s+/g, " "); // normalize multiple spaces to single
}
const searchContacts = asyncHandler(async (req, res) => {
    const { searchTerm } = req.body;
    if (!searchTerm) throw new ApiError(400, "searchTerm is required");
    const sanitizedSearchTerm = sanitizeSearchTerm(searchTerm);

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
        $and: [
            { _id: { $ne: req.user._id } },
            {
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { email: regex },
                ],
            },
        ],
    }).select("-password");
    // console.log(contacts)
    return res
        .status(200)
        .json(new ApiResponse(200, contacts, "Fetched searchTerm"));
});

const getContactsForDmList = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const contacts = await Messages.aggregate([
        {
            $match: {
                $or: [{ sender: userId }, { recipient: userId }],
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $addFields: {
                otherUser: {
                    $cond: {
                        if: { $eq: ["$sender", userId] },
                        then: "$recipient",
                        else: "$sender",
                    },
                },
            },
        },
        {
            $group: {
                _id: "$otherUser",
                lastMessageTime: { $first: "$createdAt" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "contactInfo",
            },
        },
        {
            $unwind: "$contactInfo",
        },
        {
            $project: {
                _id: 1,
                lastMessageTime: 1,
                email: "$contactInfo.email",
                firstName: "$contactInfo.firstName",
                lastName: "$contactInfo.lastName",
                image: "$contactInfo.image",
                color: "$contactInfo.color",
            },
        },
        {
            $sort: {
                lastMessageTime: -1,
            },
        },
    ]);

    // console.log(contacts)
    return res
        .status(200)
        .json(new ApiResponse(200, contacts, "Fetched searchTerm"));
});
const getAllContacts = asyncHandler(async (req, res) => {
    const users = await User.find({
        _id: { $ne: req.user._id },
    },"firstName lastName _id email");
    const contacts=users.map((user)=>({
        label:user.firstName?`${user.firstName} ${user.lastName}`:`${user.email}`,
        value:user._id
    }))
    // console.log(contacts)
    return res
        .status(200)
        .json(new ApiResponse(200, contacts, "Fetched all contacts"));
});

export { searchContacts, getContactsForDmList, getAllContacts };
