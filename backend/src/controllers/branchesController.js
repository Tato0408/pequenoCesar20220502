//#1- Creo un array de funciones vacio

const branchesController = {};

//#2 importo el Schema de la colección que voy a ocupar
import Branches from "../models/branches.js";

//SELECT

branchesController.getBranches = async (req,res) =>{
    const branches = await Branches.find()
    res.json(branches);
}

//INSEERT

branchesController.insertBranches = async (req,res) =>{
    //#1 Solicito los datos a guardar
    const {name, address, schedule, isActive} = req.body;

    //#2 Lleno el Schema con estos datos
    const newBranch = Branches({name, address, schedule,isActive})
    //#3 Guardo todo en la base de datos
    await newBranch.save();
    res.json({message : "Branch saved"})
}

//DELETE

branchesController.deleteBranches = async (req, res) => {
    await Branches.findByIdAndDelete(req.params.id);
    res.json({message : "Branch deleted"});
}

//UPDATE

branchesController.updateBranches = async (req,res) => {
 //# 1 Solicito los nuevos valores
 
 const{name, address, schedule, isActive } = req.body;

 await Branches.findByIdAndUpdate(req.params.id, {
    name, 
    address,
    schedule,
    isActive
 },{
    new: true
 })
 res.json({message : "Branch updated"})
 }

 export default branchesController;