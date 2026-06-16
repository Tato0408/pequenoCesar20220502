import express from "express";
import adminController from "../controllers/adminController.js";

const router = express.Router();

router.route("/")
.get(adminController.getAdmin)
.post(adminController.insertAdmin);

router.route("/:id")
.put(adminController.updateAdmin)
.delete(adminController.deleteAdmin);

export default router;