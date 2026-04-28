import express from "express";
import recoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = express.Router();

router.post("/requestCode", recoveryPasswordController.requestCode);
router.post("/verifyCode", recoveryPasswordController.verifyCode);
router.post("/newPassword", recoveryPasswordController.newPassword);

export default router;