import express from "express";
import customerController from "../controllers/customerController.js";

//Router() nos ayuda a colocar los métodos que vamos a usar

const router = express.Router();

router.route("/")
.get(customerController.getCustomer)

router.route("/:id")
.delete(customerController.deleteCustomer)
.put(customerController.updateCustomer)

export default router;
