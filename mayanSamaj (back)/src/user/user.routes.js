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

api.delete('/delete/:id', userController.deleteUser)

// Login
api.post('/login', userController.login);
api.put('/update/:id', userController.updateAccount);
api.get('/getAccount/:id', userController.getAccount)

api.put('/updatePassword', [ensureAuth], userController.updatePassword);
api.put('/updateEmail', [ensureAuth], userController.updateEmail);
api.get('/getProfile', [ensureAuth], userController.getProfile);

/* Image
api.put('/uploadImage', [ensureAuth], upload, userController.addImage)
api.get('/getImage/:id', userController.getImage)*/

module.exports = api;