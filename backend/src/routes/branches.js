import express from "express";
import branchesController from "../controllers/branchesController.js";

//Router() nos ayuda a colocar los métodos que vamos a usar

const router = express.Router();

router.route("/")
.get(branchesController.getBranches)
.post(branchesController.insertBranches)

router.route("/id")
.delete(branchesController.deleteBranches)
.put(branchesController.updateBranches)

export default router;
