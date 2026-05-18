import providerModel from '../models/providers.js'
import { v2 as cloudinary } from 'cloudinary'
const providerController = {}

providerController.getAllProviders = async (req, res) => {
    try {
        const response = await providerModel.find();
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({message: "Internal Server error"})
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

        return res.status(200).json({message: "Data save"})


    } catch (error) {
        
        return res.status(500).json({message: "Internal Server error"})
    }
}

providerController.updateProvider = async(req,res) =>{
    try {
        const {name,phone} = req.body

        const response = await providerModel.findById(req.params.id)

        const updateData = {
            name, 
            phone
        }

        if(req.file){
            await cloudinary.uploader.destroy(response.public_id)

            updateData.image = req.file.path
            updateData.public_id = req.file.filename
        }

        await providerModel.findByIdAndUpdate(req.params.id, updateData)
        return res.status(200).json({message: "Data updated"})
    } catch (error) {
        return res.status(500).json({message: "Internal Server error"})
    }
}

providerController.deleteProvider = async(req,res) =>{
    try {
        const response = await providerModel.findById(req.params.id)
        await cloudinary.uploader.destroy(response.public_id)
        await providerModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "Data deleted"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server error"})
    }
}

export default providerController