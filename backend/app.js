import express from 'express';
import pizzaRoutes from "./src/routes/pizza.js"
import branchesRoutes from "./src/routes/branches.js"
//Crea una constante que es igual a:
// La libreria express 
const app = express();

//Para que la api acepte JSON
app.use(express.json())


//Endpoint de pizzas
app.use("/api/pizzas", pizzaRoutes)
app.use("/api/branches", branchesRoutes)


//Exportamos la constante
export default app;


