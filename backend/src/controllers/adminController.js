import adminModel from '../models/admin.js'

const adminController = {}

adminController.getAdmin = async(req, res) => {
    try {
        const response = await adminModel.find()
        if(!response) return res.status(404).json({message: 'Data not found'})
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

adminController.insertAdmin = async(req,res) => {
    try {
        const {
            admin,
            email,
            password
        } = req.body

        const payload = new adminModel({
            admin,
            email,
            password,
            isVerified: true,
            loginAttemps: 0,
            timeOut: null
        })
        await payload.save()
        res.status(201).json({message: 'Data save', data: payload})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

adminController.updateAdmin = async(req,res) => {
    try {
        const response = await adminModel.findById(req.params.id)
        if(!response) return res.status(404).json({message: 'Data not found'})
        const {
            admin,
            email,
            password,
            isVerified
        } = req.body

        const payload = {
            admin,
            email,
            password,
            isVerified: response.isVerified,
            loginAttemps: response.loginAttemps,
            timeOut: response.timeOut
        }

        const adminUpdate = await adminModel.findByIdAndUpdate(req.params.id, payload, {new: true})
        if(!adminUpdate) return res.status(400).json({message: 'Data not updated'})
        res.status(200).json({message: 'Data updated', data: adminUpdate})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

adminController.deleteAdmin = async(req,res) => {
    try {
        const response = await adminModel.findByIdAndDelete(req.params.id)
        if(!response) return res.status(404).json({message: 'Data not found'})
        res.status(200).json({message: 'Data deleted', data: response})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export default adminController