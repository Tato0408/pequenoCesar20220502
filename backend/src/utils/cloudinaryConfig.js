import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from "multer" 
import {config} from "../../config.js"

//#1 Configuramos cloudinary con nuestras credenciales
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
})

//#2 Configurar como guardar las imágenes
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'CesarChiquito',
        allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    }
})

//#3 Configuro multer
const upload = multer({storage})

export default upload