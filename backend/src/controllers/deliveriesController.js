import deliveriesModel from '../models/deliveries.js'
import {v2 as cloudinary} from 'cloudinary'

 const deliveriesController = {}

deliveriesController.getAllDeliveries = async (req, res) => {
    try {
        const response = await deliveriesModel.find();
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({message: "Internal Server error", error: error.message})
    }
}

deliveriesController.insertDeliveries = async(req,res) => {
    try {
        const{
            name,
            phone,
            cars,
            isActive
        } =  req.body

        const payload = new deliveriesModel({
            name,
            phone,
            image: req.file.path,
            public_id: req.file.filename,
            cars,
            isActive
        })

        await payload.save()
        return res.status(200).json({message: "Delivery created successfully"})
    } catch (error) {
        return res.status(500).json({message: "Internal Server error", error: error.message})
    }
}

deliveriesController.deleteDelivery = async(req,res) => {
    try {
            const response = await deliveriesModel.findById(req.params.id);
            const deletedImage = await cloudinary.uploader.destroy(response.public_id);
            if(!response){
                return res.status(404).json({message: "Delivery not found"})
            }
            if(!deletedImage){
                const error = new Error("Error al eliminar la imagen");
                return res.status(500).json({message: "Internal Server error", error: error.message})
            }

            const deliveryDeleted = await deliveriesModel.findByIdAndDelete(req.params.id);
            if(!deliveryDeleted){
                const error = new Error("Error al eliminar el delivery");
                return res.status(500).json({message: "Internal Server error", error: error.message})
            }
            return res.status(200).json({message: "Delivery deleted successfully"})
    } catch (error) {
        return res.status(500).json({message: "Internal Server error", error: error.message})
    }
}

deliveriesController.updateDelivery = async (req, res) => {
    try {
        const {
            name,
            phone,
            cars,
            isActive
        } = req.body

        const deliveriesFound = await deliveriesModel.findById(req.params.id);
        if(!deliveriesFound){
            return res.status(404).json({message: "Delivery not found"})
        }

        const payload = {
            name,
            phone,
            cars,
            isActive
        }

        if(req.file){
            const updatedImage = await cloudinary.uploader.destroy(deliveriesFound.public_id);
            if(!updatedImage){
                const error = new Error("Error al actualizar la imagen");
                return res.status(500).json({message: "Internal Server error", error: error.message})
            }
            payload.image = req.file.path;
            payload.public_id = req.file.filename;
        }

        const deliveryUpdated = await deliveriesModel.findByIdAndUpdate(req.params.id, payload, {new: true})
        if(!deliveryUpdated){
            const error = new Error("Error al actualizar el delivery");
            return res.status(500).json({message: "Internal Server error", error: error.message})
        }   
        return res.status(200).json({message: "Delivery updated successfully", delivery: deliveryUpdated})
    } catch (error) {
        return res.status(500).json({message: "Internal Server error", error: error.message})
    }
}

 export default deliveriesController
 