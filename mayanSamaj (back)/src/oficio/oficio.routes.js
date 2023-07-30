'use strict'

const express = require('express');
const api = express.Router();
const oficioController = require('./oficio.controller');
const {ensureAuth} = require('../services/authenticated')

//Rutas Privadas 
api.get('/test', oficioController.test)
api.get('/get', [ensureAuth],oficioController.getOficios)
api.get('/get/:id',[ensureAuth],oficioController.getOficio);
api.post('/add',[ensureAuth],oficioController.addOficio)
api.put('/update/:id',[ensureAuth],oficioController.updateOficio)
api.delete('/delete/:id',[ensureAuth],oficioController.deleteOficio);

module.exports = api;