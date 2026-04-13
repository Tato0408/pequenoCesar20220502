import express from 'express';
import pizzaRoutes from "./src/routes/pizza.js"
import branchesRoutes from "./src/routes/branches.js"
import employeesRoutes from "./src/routes/employees.js"
import reviewsRoutes from "./src/routes/reviews.js"
import customerRoutes from "./src/routes/customer.js"
//Crea una constante que es igual a:
// La libreria express 
const app = express();

//Para que la api acepte JSON
app.use(express.json())


//Endpoint de pizzas
app.use("/api/pizzas", pizzaRoutes)
app.use("/api/branches", branchesRoutes)
//1.- Endpoint de empleados, posteriormente crearemos el modelo
app.use("/api/employee", employeesRoutes)
app.use("/api/reviews", reviewsRoutes)
app.use("/api/customer", customerRoutes)

//Exportamos la constante
export default app;



