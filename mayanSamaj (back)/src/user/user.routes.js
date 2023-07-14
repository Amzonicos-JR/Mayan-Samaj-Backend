const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const connectMultiparty = require('connect-multiparty')
const upload = connectMultiparty({uploadDir: './uploads/products'})

//Contractor
api.post('/registerC', userController.registerContractor)
api.get('/getC', userController.getC)
// Worker
api.post('/registerW', userController.registerWorker)
api.get('/getW', userController.getW)

api.put('/update', userController.updateAccount);
api.delete('/delete', userController.deleteUser)

// api.get('/test', productController.test);
// api.post('/add', productController.addProduct);
// api.get('/get', productController.getProducts);
// api.get('/get/:id', productController.getProduct);
// api.put('/update/:id', productController.updateProduct);
// api.delete('/delete/:id', productController.deleteProduct);
// api.put('/uploadImage/:id', upload, productController.addImage)
// api.get('/getImage/:fileName', upload, productController.getImage)

module.exports = api;