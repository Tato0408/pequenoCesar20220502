//Aqui en el controlador vamos a definir las funciones que ejecutaran
//los metodos: get(), pos(), put() y delete()
//Este CRUD es un CRUD sin validaciones, solamente es de prueba
//Paso 1: Creo un array de metodos

import pizzasModel from "../models/pizza.js";
const pizzasController = {};
//Importo el esquema que voy a  utilizar


//SELECT
pizzasController.getPizzas = async (req, res) => {
    const pizzas = await pizzasModel.find();
    res.json(pizzas);
}

//INSERT
pizzasController.insertPizza = async(req, res) =>{
    //#1-Solicitar los datos que se van a guardar
    const {name, description, price, stock } = req.body;
    //#2- Guardo en el moddelo
    const newPizza = new pizzasModel({name, description, price, stock});
    //#3- Guardar todo
    await newPizza.save();

    //#4 - mensaje
    res.json({message: "Producto Guardado"})
} 

//ELIMINAR
pizzasController.deletePizzas = async (req, res) =>{
    await pizzasModel.findByIdAndDelete(req.params.id)
    res.json({message: "pizza deleted"})
}

//ACTUALIZAR
pizzasController.updatePizzas = async(req,res) => {
    //#1- Pedir todos los datos
    const {name, description, price, stock } = req.body;
    //#2- Actualizo todos los datos
    await pizzasModel.findByIdAndUpdate(res.params.id, 
        {name, 
        description, 
        price, 
        stock}, {new: true})
    res.json({message: "pizza updated"})
}

export default pizzasController;