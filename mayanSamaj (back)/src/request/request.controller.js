'use strict'
const Job = require('../job/job.model')
const Request = require('./request.model')
const infoJob = '-requestWorkers'
const infoRequest = '-worker'
const infoUser = '-_id -password -role'

exports.test = (req, res) => {
    try{
        return res.status(200).send({message: "Si funciona ( // * ^ w ^ * // )"})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to test"})
    }
}

exports.getWorker = async(req, res) => {
    try{
        let requests = await Request.find({worker: req.user.sub}).populate('job', infoJob).select(infoRequest)
        return res.status(400).send({requests})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to getting request by worker"})
    }
}

exports.getJob = async(req, res) => {
    try{
        let idJob = req.params.id
        let job = await Job.findOne({_id: idJob})
        .populate({
            path: 'requestWorkers',
            model: 'Request',
            select: '-job',
            populate: {
                path: 'worker',
                model: 'User',
                select: infoUser
                },
            })
        let requests = job.requestWorkers
        if(!job) return res.status(404).send({message: "Job not found"})
        return res.status(200).send({requests})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to getting request by job"})
    }
}

exports.add = async(req, res) => {
    try{
        let data = req.body
        let idWorker =  req.user.sub

        //verifica que job exista
        let existJob = await Job.findOne({_id: data.job})
        if(!existJob) return res.status(404).send({message: "Job not found"})

        //verificar que no haya enviado ya una solicitud
        let job = await Job.findOne({_id: data.job}).populate('requestWorkers')
        for(let request of job.requestWorkers){
            if(request.worker.equals(idWorker))
                return res.status(409).send({message: "You already have a request"})
        }

        //asignar el id del worker a la data y el status 
        data.worker = idWorker
        data.status = "OnHold"

        //guardar la solicitud en job y en la entidad request
        let request = new Request(data)
        let addRequest = await Job.updateOne(
            {_id: data.job},
            { $push: {requestWorkers: request._id}})
        if(!addRequest) return res.status(400).send({message: 'Error to saved request in job'})
        await request.save()

        return res.status(200).send({message: "Request sent", data})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to saved request"})
    }
}

exports.accept = async(req, res) => {
    try{
        let data = req.body
        let idContractor = req.user.sub
        let idRequest = req.params.id

        //verificar que job exista
        let job = await Job.findOne({_id: data.job})
        if(!job) return res.status(404).send({message: 'Job not found'})

        //verificar que no pueda aceptar de otros trabajadores
        let existJob = await Job.findOne({_id: data.job, contractor: idContractor})
        if(!existJob) return res.status(403).send({message: 'cannot accept another contractors application'})

        //verificar que request exista en job
        let existRequest = await Job.findOne({_id: data.job, requestWorkers: idRequest})
        if(!existRequest) return res.status(404).send({message: "Request not foun in job"})

        //verifica que el request ya haya sido aceptado 
        let request = await Request.findOne({_id: idRequest})
        if(request.status === "Accepted") return res.status(409).send({message: "You have already been accepted"})

        //pasar las demas solicitudes a Rejected
        let arr = job.requestWorkers
        for(let idArr of arr){
            if(idArr.equals(idRequest)){
                await Request.findOneAndUpdate(
                    {_id: idArr},
                    {status: "Accepted"})
            }else{
                await Request.findOneAndUpdate(
                    {_id: idArr},
                    {status: "Rejected"})
            }
        }
        await Job.findOneAndUpdate(
            {_id: data.job},
            {request: idRequest ,status: "InProgress"})
        

        return res.status(200).send({message: "Accept succefully"})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to accept request"})
    }
}

exports.update = async(req, res) => {
    try{
        let idRequest = req.params.id
        let idWorker = req.user.sub
        let data = req.body

        //verificar que el request exista o editar otros request que no sea de el 
        let request = await Request.findOne({_id: idRequest, worker: idWorker})
        if(!request) return res.status(404).send({message: "Request not found or cannot update requests from other workers"})        

        // no puedo actualizar si esta en estado accepted or rejected
        if(request.status === "Rejected" || request.status === "Accepted")
            return res.status(403).send({message: `You cannot updated because your status of the request is ${request.status}`})

        let updatedRequest = await Request.findOneAndUpdate({_id: idRequest}, {duration: data.duration})    
        return res.status(200).send({message: "Updated successfully", updatedRequest})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to updated request"})
    }
}

exports.delete = async(req, res) => {
    try{
        let idRequest = req.params.id
        let idWorker = req.user.sub
        let idJob = req.body.job

        //verificar que request exista
        let existRequest = await Request.findOne({_id: idRequest})
        if(!existRequest) return res.status(404).send({message: "Request not found"})

        //verificar que el request sea del worker
        let request = await Request.findOne({_id: idRequest, worker: idWorker})
        if(!request) return res.status(404).send({message: 'You cannot delete the request of other workers'})

        //verificar que el request exista en el job
        let job = await Job.findOne({_id: idJob, requestWorkers: idRequest})
        if(!job) return res.status(404).send({message: "job not found or request not found at work"})

        //verificar que el status sea accepted 
        if(request.status === "Accepted"){
            //cambiarle el status de job Unassigned
            await Job.findOneAndUpdate(
                {_id: idJob},
                {status: "Unassigned", request: null})
    
            //los request en Rjected vuelven a estar en OnHold
            console.log(job.requestWorkers)
            let arr = job.requestWorkers
            for(let idArr of arr){
                await Request.findOneAndUpdate(
                    {_id: idArr},
                    {status: "OnHold"})
            }
        }
        
        //Eliminarlo del array de job donde pertenece
        await Job.findOneAndUpdate(
            {_id: idJob},
            {$pull: {requestWorkers: idRequest}})

        await Request.deleteOne({_id: idRequest})
        return res.status(200).send({message: "Deleted successfully"})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to deleted request"})
    }
}