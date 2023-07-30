'use strict'

const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    contractor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    oficios: {//pasarlo aun arreglo
        type: String,
        require: true
    },
    qualification: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
    },
    requestWorkers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }]
},{
    versionKey: false
})

module.exports = mongoose.model("Job", jobSchema)