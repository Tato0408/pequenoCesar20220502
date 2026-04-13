/*
Campos
- name
- lastName
- email
- birthDate
- password
- isVerified
- loginAttemps
- timeOut
*/ 

import {Schema, model} from "mongoose";

const customerSchema = new Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },  
    birthDate: {
        type: Date
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    isVerified: {
        type: Boolean
    },
    loginAttemps: {
        type: Number
    },
    timeOut: {
        type: Date
    }
},{
    timestamps: true,
    strict: false
});

export default model("Customer", customerSchema);