import express from "express";
import registerEmployeeController from "../controllers/registerEmployees.js";

//Router() nos ayuda a colocar los métodos que vamos a usar

const router = express.Router();

router.route("/").post(registerEmployeeController.insertEmployee);

router.route("/verifyCodeEmail").post(registerEmployeeController.verifyCode);

export default router;
