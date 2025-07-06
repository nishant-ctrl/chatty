import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createChannel,
    getUserChannels,
    getChannelMessages,
} from "../controllers/channel.controller.js";
const router = Router();

router.route("/create-channel").post(verifyJWT, createChannel);
router.route("/get-user-channels").get(verifyJWT, getUserChannels);
router
    .route("/get-channel-messages/:channelId")
    .get(verifyJWT, getChannelMessages);

export default router;
