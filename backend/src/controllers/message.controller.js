import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Messages } from "../models/messages.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getMessages = asyncHandler(async (req, res) => {
    const userId1 = req.user._id;
    const userId2 = req.body.id;
    if (!userId1 || !userId2)
        throw new ApiError(400, "Both user id is required is required");

    
    const messages = await Messages.find({
        $or:[
            {
                sender:userId1,
                recipient:userId2,
            },
            {
                sender:userId2,
                recipient:userId1,
            },
        ]
    }).select("-password").sort({createdAt:1});
    // console.log(messages)
    
    return res
        .status(200)
        .json(new ApiResponse(200, messages, "Messages Fetched successfully"));
});

const uploadFile=asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath){
        throw new ApiError(400, "File is required for upload");
    }
    const file = await uploadOnCloudinary(avatarLocalPath);
    if (!file)
        throw new ApiError(502, "Error while uploading on profile image");
    // console.log(file)
    return res
        .status(200)
        .json(
            new ApiResponse(200, {fileUrl:file.url,fileName:file.original_filename}, "Profile Image updated successfullu]y")
        );
})

export { getMessages, uploadFile };
