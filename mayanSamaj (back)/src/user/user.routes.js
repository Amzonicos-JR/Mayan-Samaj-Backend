const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const connectMultiparty = require('connect-multiparty')
const upload = connectMultiparty({uploadDir: './uploads/users'})
const { ensureAuth, isAdmin } = require('../services/authenticated');

//Contractor
api.post('/registerC', userController.registerContractor)
api.get('/getC', userController.getC)
// Worker
api.post('/registerW', userController.registerWorker)
api.get('/getW', userController.getW)

api.delete('/delete', userController.deleteUser)

// Login
api.post('/login', userController.login);
api.put('/update', [ensureAuth], userController.updateAccount);

// Image
api.put('/uploadImage', [ensureAuth], upload, userController.addImage)
api.get('/getImage/:fileName', upload, userController.getImage)

module.exports = api;