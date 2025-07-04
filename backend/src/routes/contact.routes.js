import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    searchContacts,
    getContactsForDmList,
} from "../controllers/contact.controller.js";
const router = Router();

router.route("/search").post(verifyJWT,searchContacts);
router.route("/get-contacts-for-dm").get(verifyJWT, getContactsForDmList);

export default router;
