import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import {config} from "../../config.js";
import adminModel from "../models/admin.js";

//Array de funciones

const loginAdminController = {};

loginAdminController.login = async(req,res) => {
    try {
        //Solicitar los datos 
        const {email, password} = req.body;
        
        //Verificar que el correo existe en la db
        const adminFound = await adminModel.findOne({email});
        if(!adminFound){
            return res.status(400).json({message: "Correo no encontrado"});
        }

        //Verificar que la cuenta no esté bloqueada

        if(adminFound.timeOut && adminFound.timeOut > Date.now()){
            return res.status(400).json({message: "Cuenta bloqueada"});
        }

        //Validar la contraseña
        const isMatch = await bcrypt.compare(password, adminFound.password);

        //Si la contrasea es incorrecra
        if(!isMatch){
            //Sumamos 1 a la cantidad de intentis fallidos
            adminFound.loginAttemps = (adminFound.loginAttemps || 0) + 1;

            if(adminFound.loginAttemps >= 5){
                adminFound.timeOut = Date.now() + 15 * 60 * 1000;
                adminFound.loginAttemps = 0;

                await adminFound.save();
                return res.status(400).json({message: "Cuenta bloqueada debido a muchos intentos fallidos"});
            }

            await adminFound.save();
            return res.status(400).json({message: "Contraseña incorrecta"});
        }

        adminFound.loginAttemps = 0;
        adminFound.timeOut = null;
        await adminFound.save();

        //generar el token

        const token = jsonwebtoken.sign(
            //¿Qué bamos a guardar?
            {id: adminFound._id, userType: "admin"},

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

export default loginAdminController;