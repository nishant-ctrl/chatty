import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { searchContacts } from "../controllers/contact.controller.js";
const router = Router();

router.route("/search").post(verifyJWT,searchContacts);

export default router;
