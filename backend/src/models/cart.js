/*
    -customerId
    -products:
        productId
        quantity
        dubtotal
    -total
    -status
*/

import mongoose, { Schema, model, trusted } from 'mongoose'

const cartSchema = new Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'pizzas',
                required: trusted
            },
            quantity: {type: Number},
            subtotal: {type: Number}
        }
    ],
    total: { type: Number },
    status: {type: String}
}, 
{
    timestamps: true,
    strict: false
})

export default model('Cart', cartSchema)