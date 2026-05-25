//En este archivo definimos los metodos que tendrá cada endpoint
import express from 'express';
import pizzasController from "../controllers/pizzaController.js"
//Router() es el que ayuda a colocar los métodos 
//que tendrá el endpoint

const router = express.Router()

router.route("/")
.get(pizzasController.getPizzas)
.post(pizzasController.insertPizza)

router.route("/search")
.post(pizzasController.searchByName)

router.route("/count")
.get(pizzasController.countPizzas)

router.route("/price")
.post(pizzasController.getPizzasByPriceRange)

router.route("/low-stock")
.post(pizzasController.getLowStock)



router.route("/:id")
.put(pizzasController.updatePizzas)
.delete(pizzasController.deletePizzas)
.get(pizzasController.getPizzaById)
export default router