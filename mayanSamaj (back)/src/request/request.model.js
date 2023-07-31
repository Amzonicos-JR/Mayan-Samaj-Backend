'use strict'

const mongoose = require('mongoose')

const requestSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    duration: {
        type: String,
        require: true
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    status: {
        type: String,
        require: true
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('Request', requestSchema)