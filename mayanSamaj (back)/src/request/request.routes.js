'use strict'
const express = require('express')
const api = express.Router()
const requestController = require('./request.controller')
const { ensureAuth, isAdmin} = require('../services/authenticated')

api.get('/test', requestController.test)
api.get('/getWorker', [ensureAuth], requestController.getWorker)
api.get('/getJob/:id', requestController.getJob)
api.post('/add', [ensureAuth], requestController.add)
api.put('/accept/:id', [ensureAuth], requestController.accept)
api.put('/update/:id', [ensureAuth], requestController.update)
api.delete('/delete/:id',[ensureAuth], requestController.delete)

module.exports = api