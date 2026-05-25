import cartModel from '../models/cart.js'
import pizzaModel from '../models/pizza.js'

const cartController = {}

cartController.getCart = async(req,res) => {
    try {
        const response = await cartModel.find()
        .populate('customerId', "name email -customerId")
        .populate('productId', "name price -productId");
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

export default cartController;