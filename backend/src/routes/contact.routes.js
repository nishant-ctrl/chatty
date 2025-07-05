import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    searchContacts,
    getContactsForDmList,
    getAllContacts,
} from "../controllers/contact.controller.js";
const router = Router();

router.route("/search").post(verifyJWT,searchContacts);
router.route("/get-contacts-for-dm").get(verifyJWT, getContactsForDmList);
router.route("/get-all-contacts").get(verifyJWT, getAllContacts);

export default router;
