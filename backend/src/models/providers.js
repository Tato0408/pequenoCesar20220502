import mongoose ,{Schema, model}from "mongoose";

const providersSchema = new Schema({
    name: {type: String},
    phone:{type: String},
    image:{type: String},
    public_id:{type: String}
    
}, {timestamps: true,
        strict: false
    })

export default model("Provider", providersSchema)
