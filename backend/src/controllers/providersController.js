import providerModel from '../models/probiders,js'
import { v2 as cloudinary } from 'cloudinary'

const providerController = {}

providerController.getAllProviders = async (req, res) => {
    try {
        const response = await providerModel.find();
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" })
    }
}

providerController.insertProviders = async (req, res) => {
    try {
        //#1 Solicitar los datos
        const { name, phone } = req.body
        const newProvider = new providerModel({ name, 
            phone, 
            image: req.file.path,
            public_id: req.file.filename 
        });

        await newProvider.save();

        return res.status(200).json({message: "Data save" })


    } catch (error) {
        
        return res.status(500).json({ message: "Internal Server error" })
    }
}

providerController.updateProvider = async(req,res) =>{
    try {
        const {name,phone} = req.body

        const response = await providerModel.findByIdAndUpdate(req.params.id)

        const updateDate = {
            name, 
            phone
        }

        if(req,file){
            
        }
        return res.status(200).json({message: "Data updated" })
    } catch (error) {
        
    }
}




export default providerController