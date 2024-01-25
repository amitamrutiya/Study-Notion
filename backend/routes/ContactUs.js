import { Router } from "express";
const router = Router();
import { contactUsController } from "../controllers/contactUs.controller.js";

router.post("/contact", contactUsController);

export default router;
