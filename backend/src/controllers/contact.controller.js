import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

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




export { searchContacts };
