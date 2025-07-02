import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../utils/cloudinary.js";
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and acces token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Email and password are required");
    }
    const existedUser = await User.findOne({
        $or: [{ email }],
    });
    if (existedUser) throw new ApiError(409, "User with email already exists");
    const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser)
        throw new ApiError(500, "Something went wrong while registering user");
    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) throw new ApiError(400, "username or email is requires");
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User does not exist");
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Password is incorrect");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "user logged in successfuly"
            )
        );
});

const getUserInfo = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        );
});
const updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName || color === undefined)
        throw new ApiError(400, "Fields are required for updation");
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                firstName,
                lastName,
                color,
                profileSetup: true,
            },
        },
        { new: true }
    ).select("-password");
    res.status(200).json(
        new ApiResponse(200, user, "Account details updated successfully")
    );
});
const addProfileImage = asyncHandler(async (req, res) => {
    // console.log(req.file)
    const avatarLocalPath = req.file?.path;
    // const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath)
        throw new ApiError(400, "Profile image is required for updation");
    const profileImage = await uploadOnCloudinary(avatarLocalPath);
    if (!profileImage)
        throw new ApiError(502, "Error while uploading on profile image");

    if (req.user.image !== "") {
        const isDeleted = await deleteFromCloudinary(req.user.image);
        if (!isDeleted)
            console.log(
                "Sommething went wrong while deleting the old avatar from cloudinary"
            );
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                image: profileImage.url,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Profile Image updated successfullu]y")
        );
});
const removeProfileImage = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                image: null,
            },
        },
        { new: true }
    ).select("-password");
    const isDeleted = await deleteFromCloudinary(req.user.image);
    if (!isDeleted)
        console.log(
            "Sommething went wrong while deleting the old avatar from cloudinary"
        );
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Profile Image deleted successfullu]y")
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Userloggedout"));
});
export {
    registerUser,
    loginUser,
    getUserInfo,
    updateProfile,
    addProfileImage,
    removeProfileImage,
    logoutUser,
};
