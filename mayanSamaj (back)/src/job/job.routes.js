'use strict'
const express = require('express')
const api = express.Router()
const jobController = require('./job.controller')
const { ensureAuth, isAdmin } = require('../services/authenticated')

api.get('/test', jobController.test)
api.get('/getmyjob', [ ensureAuth ], jobController.getmy)
api.get('/get/:id', jobController.get)
api.get('/gets', jobController.gets)
api.get('/getsunassigned', jobController.getsU)
api.get('/getapplied', [ensureAuth], jobController.getapplied)
api.get('/getnotapplied', [ensureAuth], jobController.getnotapplied)
api.get('/getinprogress', [ensureAuth], jobController.getinprogress)
api.get('/getcompleted', [ensureAuth], jobController.getcompleted)
api.post('/add', [ ensureAuth ], jobController.add)
api.put('/update/:id', [ ensureAuth ], jobController.update)
api.put('/completed/:id', [ensureAuth], jobController.completed)
api.delete('/delete/:id', [ ensureAuth ], jobController.delete)

module.exports = api;