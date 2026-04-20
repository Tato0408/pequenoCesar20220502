import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import {config} from "../../config.js";
import customerModel from "../models/customers.js";

//Array de funciones

const loginCustomerController = [];

loginCustomerController.login = async(req,res) => {
    try {
        //Solicitar los datos 
        const {email, password} = req.body;
        
        //Verificar que el correo existe en la db
        const customerFound = await customerModel.findOne({email});
        if(!customerFound){
            return res.status(400).json({message: "Correo no encontrado"});
        }

        //Verificar que la cuenta no esté bloqueada

        if(customerFound.timeOut && customerFound.timeOut > Date.now()){
            return res.status(400).json({message: "Cuenta bloqueada"});
        }

        //Validar la contraseña
        const isMatch = await bcrypt.compare(password, customerFound.password);

        //Si la contrasea es incorrecra
        if(!isMatch){
            //Sumamos 1 a la cantidad de intentis fallidos
            customerFound.loginAttemps = (customerFound.loginAttemps || 0) + 1;

            if(customerFound.loginAttemps >= 5){
                customerFound.timeOut = Date.now() + 15 * 60 * 1000;
                customerFound.loginAttemps = 0;

                await customerFound.save();
                return res.status(400).json({message: "Cuenta bloqueada debido a muchos intentos fallidos"});
            }

            await customerFound.save();
            return res.status(400).json({message: "Contraseña incorrecta"});
        }

        customerFound.loginAttemps = 0;
        customerFound.timeOut = null;
        await customerFound.save();

        //generar el token

        const token = jsonwebtoken.sign(
            //¿Qué bamos a guardar?
            {id: customerFound._id, userType: "customer"},

            //Secret key
            config.JWT.secret,
            {expiresIn: '30d'}
        );

        //El token se guarda en una cookie

        res.cookie("authCookie", token );
        return res.status(200).json({message: "Login exitoso"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor"});
    }
}

export default loginCustomerController;