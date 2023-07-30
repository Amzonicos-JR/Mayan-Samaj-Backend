'use strict'
const express = require('express')
const api = express.Router()
const receiptController = require('./receipt.controller')

api.post('/generate', receiptController.generateReceipt)
api.get('/get/:id', receiptController.getByUser)

module.exports = api;