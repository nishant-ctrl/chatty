import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message.controller.js";
const router = Router();

router.route("/get-messages").post(verifyJWT, getMessages);

export default router;
