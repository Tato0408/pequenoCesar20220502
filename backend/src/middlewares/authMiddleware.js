import jsonwebtoken from "jsonwebtoken";
import {config} from "../../config.js";

export const validateAuthCookie = (allowedTypes = []) => {
    return (req, res, next) => { //Cuando esté la palabra next en los parametros, si o si es un middleware
        try {
            //1. Extraer el token que está en la cookie (authCookie) ya que en esa cookie está el tipomde usuario guardado
            const {authCookie} = req.cookies;

            if(!authCookie) return res.status(403).json({message: "No cookie found. Unauthorized"})
            
            //2. Extraer toda la infromación de la cookie
            const decoded = jsonwebtoken.verify(authCookie, config.JWT.secret);

            //Verificar si el rol que tiene la cookie puede pasar o no
            if(!allowedTypes.includes(decoded.userType)) return res.status(403).json({message: "Forbidden"});
            
            //Si el rol si está, podemos continuar
            next();
        } catch (error) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}