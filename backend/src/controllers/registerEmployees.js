import employeeModel from '../models/employee.js'
import * as nodemailer from 'nodemailer'
import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {config} from "../../config.js"

const registerEmployeeController = {};

registerEmployeeController.insertEmployee = async (req,res) => {
    try {
        let{
        name, 
        lastName, 
        email, 
        password, 
        birthDate, 
        isVerified, 
        status, 
        idBranch, 
        DUI
        } = req.body;

        name = name?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!name || !email || !password) {
        return res.status(400).json({message: "Field required"});
    }
    if(name .length < 3 || name.length > 20){
        return res.status(400).json({message: "name must be real"})
    }

    //Validación de la fecha
    if(birthDate > new Date() || birthDate < new Date("1910-01-01")){
        return res.status(400).json({message: "birthDate must be real"})
    }

    if(DUI.length > 10 || DUI.length < 9){
        return res.status(400).json({message: "DUI must be real"})
    }


    const existEmployee = await employeeModel.findOne({DUI})
    const existEmployeeEmail = await employeeModel.findOne({email})
    if(existEmployee){
        return res.status(400).json({message: "Employee with this DUI already exists"})
    }
    if(existEmployeeEmail){
        return res.status(400).json({message: "Employee with this email already exists"})
    }
    const passwordHashed = await bcrypt.hash(password, 10)

    const randomCode = crypto.randomBytes(3).toString("hex")

    const token = jsonwebtoken.sign(
        {
            randomCode, 
            name,
            lastName,
            email,
            password: passwordHashed,
            birthDate,
            isVerified,
            status,
            idBranch,
            DUI
        },
        config.JWT.secret,
        {
            expiresIn: "15m"  
        }
    );

    res.cookie("registrationCookie",token,{maxAge: 15*60*1000})

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
    })
}
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }

}

registerEmployeeController.verifyCode = async(req,res) => {
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
            status,
            idBranch,
            DUI
        } = decode;

        if(verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Invalid code"});
        }
        
        // Si todo está bien, y el usuario, lo registramos en la DB

     const newEmployee = new employeeModel({
      name, 
      lastName, 
      email, 
      password, 
      birthDate, 
      isVerified: true, 
      status, 
      idBranch, 
      DUI
     });

     await newEmployee.save();

     return res.status(200).json({message: "Employee registered successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




export default registerEmployeeController;


