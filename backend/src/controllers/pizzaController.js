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

//SELECT mediante el id
pizzasController.getPizzaById = async(req,res) =>{
    try {
        const response = await pizzasModel.findById(req.params.id)
        if (!response ) return res.status(400).json({message: "Data not found"})
        return res.status(200).json({ data: response})
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})        
    }
}

//Obtener pizzas con stock bajo
pizzasController.getLowStock = async(req,res) =>{
    try {
        const response = await pizzasModel.find({stock: {$lt: 5}})
        if(!response) return res.status(404).json({message: "Data not found"})
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

//SELECT CON FILTROS
pizzasController.getPizzasByPriceRange = async(req,res) => {
    try {
        const {min, max} = req.body;
        const response = await pizzasModel.find({
            $gte: min, $lte: max
        })
        if(!response) return res.status(404).json({message: "Data not found"})
        return res.status(200).json({Data: response})
        } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

//Contar cuantos elementos hay en una colecicón
pizzasController.countPizzas = async (req,res) => {
    try {
        const response = await pizzasModel.countDocuments();
        return res.status(200).json({data: response})
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

//Buscar por nombre
pizzasController.searchByName = async(req,res) => {
    try {
        const {name}= req.body
        const response = await pizzasModel.find({
            name: {$regex: name, $options: "i"}
        })
        if(!response) return res.status(404).json({message: "Data not found"})
        return res.status(200).json({data: response})
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}



export default pizzasController;