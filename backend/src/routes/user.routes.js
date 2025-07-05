import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserInfo,
    updateProfile,
    addProfileImage,
    removeProfileImage,
    logoutUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user-info").get(verifyJWT, getUserInfo);
router.route("/update-profile").post(verifyJWT, updateProfile);
router
    .route("/add-profile-image")
    .post(verifyJWT, upload.single("profile-image"), addProfileImage);
router.route("/remove-profile-image").delete(verifyJWT,removeProfileImage) 
router.route("/logout").post(verifyJWT, logoutUser);   
    
    
export default router;

