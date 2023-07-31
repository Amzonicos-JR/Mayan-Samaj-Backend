'use strict'
const express = require('express')
const api = express.Router()
const emailController = require('./email.controller')

api.post('/send/:id', emailController.sendEmail)
api.get('/get/:id', emailController.getByUser)
api.get('/see/:id', emailController.seeEmail);
module.exports = api;