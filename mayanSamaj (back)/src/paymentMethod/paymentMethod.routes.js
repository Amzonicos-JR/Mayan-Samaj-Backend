'use strict'

const express = require('express');
const api = express.Router();
const paymentMethodController = require('./paymentMethod.controller');
const { ensureAuth } = require('../services/authenticated')


//Rutas Privadas 
api.get('/test', paymentMethodController.test)
api.get('/get', [ensureAuth],paymentMethodController.getPaymentMethods)
api.get('/get/:id', [ensureAuth],paymentMethodController.getPaymentMethod);
api.post('/add', [ensureAuth],paymentMethodController.addPaymentMethod)
api.put('/update/:id', [ensureAuth],paymentMethodController.updatePaymentMethod)
api.delete('/delete/:id', [ensureAuth],paymentMethodController.deletePaymentMethod);

module.exports = api;