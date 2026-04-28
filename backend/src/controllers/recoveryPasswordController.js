import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import HTMLRecoveryMail from '../utils/sendRecoveryMail.js'

import {config} from '../../config.js'
import customermModel from '../models/customers.js'

const recoveryPassword = {};

recoveryPassword.requestCode = async(req,res) =>{
    try {
        const {email} = req.body;
        
        //Validar que el correo si exista en la base
        const userFound = await customermModel.findOne({email});
        if(!userFound){
            return res.status(400).json({message: 'User not found'});
        }

        const randomCode=  crypto.randomBytes(3).toString('hex');
        const token = jsonwebtoken.sign(
            {email, randomCode, userType: "customer", verified: false},
            config.JWT.secret,
            {
                expiresIn: "15m"
            }
        )

        res.cookie("recoveryCookie", token, {maxAge: 15*60*1000});

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
        });

        const mailOptions = {
            from:  config.email.user_email,
            to: email,
            subject: 'Código de recuperación',
            body: "El código vence en 15 min",
            html: HTMLRecoveryMail(randomCode)
        }
        
         transporter.sendMail(mailOptions, (error, info) =>{
            if(error){
                console.error(error);
                return res.status(500).json({message: 'Error sending email'});
            } 
        });
        
        res.status(200).json({message: 'Code sent successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

recoveryPassword.verifyCode = async(req,res) => {
    try {
        const {code} = req.body;
        
        const token = req.cookies.recoveryCookie;
        const decode= jsonwebtoken.verify(token, config.JWT.secret);

        if(code !== decode.randomCode){
            return res.status(400).json({message: 'Invalid code'});
        }

        const newToken = jsonwebtoken.sign(
            {email: decode.email, userType: "customer", verified: true},
            config.JWT.secret,
            {
                expiresIn: "15m"
            }
        )
        res.cookie("recoveryCookie", newToken, {maxAge: 15*60*1000});
        res.status(200).json({message: "Código válido"})
    }
    
    
    catch (error) {
        console.log("error", error)
    }
}

recoveryPassword.newPassword = async(req, res) => {
    try {
     const {newPassword, confirmedPassword} = req.body;
     
     if(newPassword !== confirmedPassword){
        return res.status(400).json({message: 'Las contraseñas no coinciden'});
     }
        //Comprobar que la constante verified que está en el token ya esté en true

        const token = req.cookies.recoveryCookie;
        const decode = jsonwebtoken.verify(token, config.JWT.secret);

        if(!decode.verified){
            return res.status(400).json({message: "Code not verifies"})
        }

        //Encriptar la contraseña
        const passwordHashed =  await bcrypt.hash(newPassword, 10)

        //Actualizar la contraseña en la base de datos
        await customermModel.findOneAndUpdate({email: decode.email}, {password: passwordHashed})
        res.clearCookie("recoveryCookie")
        res.status(200).json({message: "Password updated successfully"})
     
    } catch (error) {
        console.log("error", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export default recoveryPassword;


