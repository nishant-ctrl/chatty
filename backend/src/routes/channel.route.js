import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createChannel,
    getUserChannels,
} from "../controllers/channel.controller.js";
const router = Router();

router.route("/create-channel").post(verifyJWT, createChannel);
router.route("/get-user-channels").get(verifyJWT, getUserChannels);

export default router;
