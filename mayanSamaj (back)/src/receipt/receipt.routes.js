'use strict'
const express = require('express')
const api = express.Router()
const receiptController = require('./receipt.controller')

api.post('/generate', receiptController.generateReceipt)

module.exports = api;