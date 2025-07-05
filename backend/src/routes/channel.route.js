import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {createChannel} from "../controllers/channel.controller.js"
const router = Router();

router.route("/craete-channel").post(verifyJWT, createChannel);
// router.route("/upload-file").post(verifyJWT, upload.single("file"), uploadFile);

export default router;
