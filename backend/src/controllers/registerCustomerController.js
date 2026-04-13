import customerModel from '../models/customers.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'


registerCustomerController = {};

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
    const existCustomer = await customerModel.findOne(email)
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
        {expiresIn: '15m'}
    );

    //guardamos el token en una cookie
    res.cookie("resgistrationCookie",token,{maxAge: 15*60*1000})
    
    const newCustomer = new customerModel({
      name, 
      lastName, 
      email, 
      password, 
      birthDate, 
      isVerified,
      loginAttemps,
      timeOut
    });
    await newCustomer.save();
    return res.status(201).json({message: "Customer created successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}
