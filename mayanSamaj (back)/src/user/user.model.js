'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    surname:{
        type: String,
        lowercase: true,
        required: true
    },
    phone:{
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        uppercase: true, // Aplicar transformación a mayúsculas
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        uppercase: true
    },
    image:{
        type: String
    }
    
},{
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);