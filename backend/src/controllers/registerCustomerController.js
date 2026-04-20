import customerModel from '../models/customers.js'
import * as nodemailer from 'nodemailer'
import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import {config} from "../../config.js"
const registerCustomerController = {};

registerCustomerController.insertCustomer = async (req,res) => {
    try {
        let{
            name,
            lastName,
            email,
            password,
            birthDate,
            isVerified,
            loginAttemps,
            timeOut
        } = req.body;

        name = name?.trim();
        lastName = lastName?.trim();
        email = email?.trim();

        if(!name || !lastName || !email || !password){
            return res.status(400).json({message: "Field required"});
        }

        if(name .length < 3 || name.length > 20){
        return res.status(400).json({message: "name must be real"})
    }
    //Validar que el correo no exista
    const existCustomer = await customerModel.findOne({ email: email})
    if(existCustomer){
        return res.status(400).json({message: "Email already exists"})
    }

    //Encriptar la conraseña
    const passwordHashed = await bcrypt.hash(password, 10)

    //generar codigo aleatorio

    const randomCode = crypto.randomBytes(3).toString('hex')

    //Guardamos todo en un token
    const token = jsonwebtoken.sign(
        // ¿Qué vamos a guardar?
        {randomCode,
            name,
            lastName,
            email,
            password: passwordHashed,
            birthDate,
            isVerified,
            loginAttemps,
            timeOut
        },
        // Secret key
        config.JWT.secret,
        //Expiración
        {expiresIn: '15m'}
    );

    //guardamos el token en una cookie
    res.cookie("registrationCookie",token,{maxAge: 15*60*1000})

    //Enviar correo electrónico
    //1 Transporter -> ¿Qui en lo envía?
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:config.email.user_email,
            pass:config.email.user_password
        }
    });

    // mailOptions -> ¿Quién lo recibe y cómo?
    const mailOptiones = {
        from: config.email.user_email,
        to: email,
        subject: "Verificación de cuenta",
        text: "Código de verificación: " + randomCode + " expira en 15 minutos"
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptiones, (error, info)=> {
        if(error){
            console.log(error);
            return res.status(500).json({message: "Error sending email"});
        }

        return res.status(200).json({message: "Email Sent"})
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//Verificar el código que se acaba de enviar

registerCustomerController.verifyCode = async(req,res) => {
    try {
        console.log("Cookies", req.cookies);
        const {verificationCodeRequest} = req.body;
        //Extraer todo los datos del token
        const token = req.cookies.registrationCookie;
        const decode = jsonwebtoken.verify(token, config.JWT.secret);
        const {
            randomCode: storedCode,
            name,
            lastName,
            email,
            password,
            birthDate,
            isVerified,
            loginAttemps,
            timeOut
        } = decode;

        if(verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Invalid code"});
        }
        
        // Si todo está bien, y el usuario, lo registramos en la DB

     const newCustomer = new customerModel({
      name, 
      lastName, 
      email, 
      password, 
      birthDate, 
      isVerified: true
    });
    await newCustomer.save();
    res.clearCookie("registrationCookie");
    return res.status(200).json({message: "Customer created successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default registerCustomerController;