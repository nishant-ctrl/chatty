import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserInfo,
    updateProfile,
} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user-info").get(verifyJWT,getUserInfo);
router.route("/update-profile").post(verifyJWT, updateProfile);

export default router;
