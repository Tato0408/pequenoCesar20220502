import express from "express";
import cartController from "../controllers/cartController.js";

//Router() nos ayuda a colocar los métodos que vamos a usar

const router = express.Router();

router.route("/")
.get(cartController.getCart)
.post(cartController.insertCart)
router.route("/id")
.delete(cartController.deleteCart)
.put(cartController.updateCart)

export default router;
