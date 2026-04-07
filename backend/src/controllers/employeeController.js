//1# Creamos  un array de funciones 

const employeeController = {};

//2# Importamos el schema que se utilizará
import employeesModel from "../models/employee.js";

//SELECT

employeeController.getEmployeee = async (req,res) => {
    try{
        const employees = await employeesModel.find();
        return res.status(200).json(employees);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//INSERT

employeeController.createEmployee = async (req,res) => {
    try{
     //1# Solicitamos los datos a guardar
     
     let {name, 
        lastName, 
        email, 
        password, 
        birthDate, 
        isVerified, 
        status, 
        idBranch, 
        DUI
    } = req.body;

    //VALIDACIONES
    //Sanitizar

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

    const newEmployee = new employeesModel({
      name, 
      lastName, 
      email, 
      password, 
      birthDate, 
      isVerified, 
      status, 
      idBranch, 
      DUI
    });
    await newEmployee.save();
    return res.status(201).json({message: "Employee created successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//DELETE
employeeController.deleteEmployee = async (req, res) =>{
    try {
        const deleteEmployee = await employeesModel.findByIdAndDelete(req.params.id);
         if(!deleteEmployee) return res.status(400).json({message: "Employee not found"})
        return res.status(200).json({message: "Employee deleted successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//UPDATE

employeeController.updateEmployee = async (req,res)=> {
    try {
        //1# Solicitamos los nuevos datos
        let {name, 
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

    const employeeUpdated =  await employeesModel.findByIdAndUpdate(req.params.id, {
        name, 
        lastName, 
        email, 
        password, 
        birthDate, 
        isVerified, 
        status, 
        idBranch, 
        DUI
    }, {new: true});

    if(!employeeUpdated) return res.status(404).json({message: "Employee not found"})
    return res.status(200).json({message: "Employee updated successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default employeeController;