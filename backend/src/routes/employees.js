import express from "express";
import employeeController from "../controllers/employeeController.js";

//Router() nos ayuda a colocar los métodos que vamos a usar

const router = express.Router();

router.route("/")
.get(employeeController.getEmployeee)
.post(employeeController.createEmployee)

router.route("/id")
.delete(employeeController.deleteEmployee)
.put(employeeController.updateEmployee)

export default router;
