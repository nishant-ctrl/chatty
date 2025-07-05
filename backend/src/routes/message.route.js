import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getMessages, uploadFile } from "../controllers/message.controller.js";
const router = Router();

router.route("/get-messages").post(verifyJWT, getMessages);
router.route("/upload-file").post(verifyJWT,upload.single("file"),uploadFile)


export default router;
