/*
Campos:
- name
- lastName
- email
- birthDate
- password
- isVerified
- DUI
- status
- idBranch
*/

//Importamos mongoose desde la libreria de mongoose
import mongoose, {Schema, model} from "mongoose";

const employeeSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type: String},
    birthDate: {type: Date},
    password: {type: String},
    isVerified: {type: Boolean},
    DUI: {type: String},
    status: {type: String},
    idBranch: {
        type: mongoose.Schema.Types.ObjectId,
        //Referenciamos al id de la colección de branches
        //Este nombre tiene que ser exactamente al nombre que eata dentro del export de la colección MODEL de la tabla que estoy referenciando
        ref: "Branches"
    }
},{
    timestamps: true,
    strict: false
});

//El primer nombre va a ser de como se llamará la colección en la base de datos
//El segundo es la constande del schema
export default model("Employees", employeeSchema)