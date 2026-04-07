//Aca definimos el esquema de la colección

/*
Campos:
    name
    dexcription
    price
    stock
*/

import {Schema, model} from "mongoose"

const pizzaSchema = new Schema({
    name:{
        type: String
    },
    description:{
        type: String
    },
    price:{
        type: Number
    },
    stock:{
        type: Number
    }
},{
    //timestamp significa que se guardaran las fechas de creacion y actualizacion
    timestamps: true,
    //strict significa que se guardaran los campos que no esten definidos en el esquema
    strict: false
})
//El primer nombre va a ser de como se llamará la colección en la base de datos
//El segundo es la constande del schema
export default model("pizzas", pizzaSchema)