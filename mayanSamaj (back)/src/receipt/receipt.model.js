'use strict'

const mongoose = require('mongoose')

const receiptSchema =  mongoose.Schema({
    contractor: {
        type: String,
        require: true
    },    
    jobDescription: {
        type: String,
        require: true
    },
    totalPay: {
        type: Number,
        require: true
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Receipt', receiptSchema)