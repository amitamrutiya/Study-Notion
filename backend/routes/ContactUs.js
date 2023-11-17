import { Router } from "express";
const router = Router();
import { contactUsController } from "../controllers/ContactUs.controller";

router.post("/contact", contactUsController);

export default router;
