import express from "express";
import reviewsController from "../controllers/reviewsController.js";

//Router() nos ayuda a colocar los métodos que vamos a usar

const router = express.Router();

router.route("/")
.get(reviewsController.getReviews)
.post(reviewsController.createReview)

router.route("/id")
.delete(reviewsController.deleteReview)
.put(reviewsController.updateReview)

export default router;
