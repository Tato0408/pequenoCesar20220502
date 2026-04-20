import express from "express";
import registerCustomerController from "../controllers/registerCustomerController.js";

//Router() nos ayuda a colocar los métodos que vamos a usar

const router = express.Router();

router.route("/").post(registerCustomerController.insertCustomer);

router.route("/verifyCodeEmail").post(registerCustomerController.verifyCode);

export default router;
