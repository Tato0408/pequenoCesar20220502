import express from 'express';
import pizzaRoutes from "../backend/src/routes/pizza.js"
//Crea una constante que es igual a:
// La libreria express 
const app = express();

//Endpoint de pizzas
app.use("/api/pizzas,", pizzaRoutes)

//Para que la api acepte JSON
app.use(express.json())

//Exportamos la constante
export default app;


