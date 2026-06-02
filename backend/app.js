import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import pizzaRoutes from "./src/routes/pizza.js"
import branchesRoutes from "./src/routes/branches.js"
import employeesRoutes from "./src/routes/employees.js"
import reviewsRoutes from "./src/routes/reviews.js"
import customerRoutes from "./src/routes/customer.js"
import registerCustomerRoutes from "./src/routes/registerCustomer.js"
import registerEmployeeRoutes from "./src/routes/registerEmployee.js"
import loginCustomerRoutes from "./src/routes/loginCustomer.js"
import logoutRoutes from './src/routes/logout.js';
import recoveryPasswordRoutes from './src/routes/recoveryPassword.js';
import providerRoutes from './src/routes/providers.js';
import cartRoutes from './src/routes/cart.js'
import wompiRoutes from './src/routes/wompi.js'
import deliveriesRoutes from './src/routes/deliveries.js'
//Crea una constante que es igual a:
// La libreria express 
const app = express();
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials:true
}))
//Para que la api acepte JSON
app.use(express.json())
app.use(cookieParser())

//Endpoint de pizzas
app.use("/api/pizzas", pizzaRoutes)
app.use("/api/branches", branchesRoutes)
//1.- Endpoint de empleados, posteriormente crearemos el modelo
app.use("/api/employee", employeesRoutes)
app.use("/api/registerEmployee", registerEmployeeRoutes)

app.use("/api/loginCustomer", loginCustomerRoutes)
app.use("/api/registerCustomer", registerCustomerRoutes)
app.use("/api/customer", customerRoutes)
app.use("/api/logout", logoutRoutes)
app.use("/api/reviews", reviewsRoutes)
app.use("/api/providers", providerRoutes)
app.use("/api/recoveryPassword", recoveryPasswordRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wompi", wompiRoutes)
app.use("/api/deliveries", deliveriesRoutes)
//Exportamos la constante
export default app;



