'use strict'

const mongoose = require('mongoose');

const paymentMethodSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    }, 
    paymentMethod_type:{
        type: String,
        required: true
    }
},
{
    versionKey:false 
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);