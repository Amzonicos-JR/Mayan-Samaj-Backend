'use strict'
const express = require('express')
const api = express.Router()
const jobController = require('./job.controller')
const { ensureAuth, isAdmin } = require('../services/authenticated')

api.get('/test', jobController.test)
api.get('/get/:id', jobController.get)
api.get('/gets', jobController.gets)
api.post('/add', [ ensureAuth ], jobController.add)
api.put('/update/:id', [ ensureAuth ], jobController.update)
api.delete('/delete/:id', [ ensureAuth ], jobController.delete)

module.exports = api;