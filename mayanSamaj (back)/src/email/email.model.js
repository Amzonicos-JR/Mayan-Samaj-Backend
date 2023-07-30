'use strict'

const mongoose = require('mongoose')

const emailSchema =  mongoose.Schema({
    from: {
        type: String,
        require: true,
        uppercase: true,
    },    
    subject: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    for: {
        type: String,
        require: true,
        uppercase: true,
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Email', emailSchema)