import cartModel from '../models/cart.js'
import pizzaModel from '../models/pizza.js'

const cartController = {}

cartController.getCart = async(req,res) => {
    try {
        const response = await cartModel.find()
        .populate('customerId', "name email -_id")
        .populate('products.productId', "name price -_id");
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

cartController.insertCart = async(req,res) => {
    try {
        //#1-Solicitamos los datos
        const {customerId, products, status} = req.body;
        
        //Variable para guardar el total
        let total = 0;
       
        //Arreglo de productos

        const newProducts = [];

        //De todos los productos que me envíe el frontend, se recorreran uno por uno para calcularles el total y el subtotal

        for(let i = 0; i < products.length; i++){
            const pizzaFound = await pizzaModel.findById(products[i].productId);

            //Calcular el subtotal
            const subtotal =  pizzaFound.price * products[i].quantity;

            //Calcular el total
            total += subtotal;

            //Guardamos el producto junto la cantidad y el subtotal

            newProducts.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subtotal: subtotal
            })
        }

        const newCart = new cartModel({
            customerId,
            products: newProducts,
            total,
            status
        })

        await newCart.save();
        res.status(201).json({message: "Data saved successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

cartController.updateCart = async (req, res) => {
    try {
       
        //#1 - Solicitamos los nuevos datos
        const {customerId, products, status} = req.body
 
        //Varible para el total
        let total = 0
 
        //Arreglo de productos
        let newProducts = []
 
        //Recorrer todos los productos
        for (let i = 0; i < products.length; i++){
 
            //Buscar el producto
            const pizzaFound = await pizzaModel.findById(products[i].productId)
            
            const subtotal = pizzaFound.price * products[i].quantity

            total += subtotal
            
            newProducts.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subtotal : subtotal
            })
        }

        //Actualizar

        const updateCart = await cartModel.findByIdAndUpdate(
            req.params.id,
            {
                customerId,
                products: newProducts,
                total,
                status,
            },
            {new: true}
        )

        return res.status(200).json({message: "Data updated"})
 
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

cartController.deleteCart = async (req, res) => {
    try {
    await cartModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({message : "Data deleted"});
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default cartController;