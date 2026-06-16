import customerModel from '../models/customers.js'
import bcrypt from 'bcrypt'
const customerController = {};

customerController.getCustomer = async(req,res) => {
    try {
     const customer = await customerModel.find();
    res.status(200).json(customer);   
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

customerController.updateCustomer = async(req,res)=>{
    try {
        let{
            name,
            lastName,
            email,
            password,
            birthDate,
            isVerified
            
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
    const hashedPass = await bcrypt.hash(password, 10)
    const payload = {
        name, 
        lastName,
        email,
        password: hashedPass,
        birthDate,
        isVerified
    }
    const customerUpdate = await customerModel.findByIdAndUpdate(req.params.id, payload, {new: true})
    
    
    if(!customerUpdate) return res.status(404).json({message: "Customer not found"})
    return res.status(200).json({message: "Customer updated successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

customerController.deleteCustomer = async(req,res)=>{
    try {
        const deleteCustomer = await customerModel.findByIdAndDelete(req.params.id);
        if(!deleteCustomer) return res.status(404).json({message: "Customer not found"});
        return res.status(200).json({message: "Customer deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default customerController;