'use strict'
const User = require('../user/user.model')
const Job = require('./job.model')
const Request = require('../request/request.model')
const infoWorker = '-_id '
const infoUser = '-_id -password -role'
const infoRequest = '-_id -job'

exports.test = async(req, res) => {
    try{
        return res.status(200).send({message: "Si funciona ( * // ^ w ^ // * )"})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to test"})
    }
}

exports.gets = async(req, res) => {
    try{
        let jobs = await Job.find()
        return res.status(200).send({jobs})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting jobs'})
    }
}

exports.get = async(req, res) => {
    try{
        let idJob = req.params.id
        let job = await Job.findOne({ _id: idJob })
            .populate({
                path: 'requestWorkers',
                model: 'Request',
                select: infoRequest,
                populate: {
                    path: 'worker',
                    model: 'User',
                    select: infoUser,
                    },
                })

        if(!job) return res.status(404).send({message: "Job not found"})
        return res.status(200).send({message: "hola", job})
    }catch(err){
        console.log(err)
        return res.status(500).send({message: "Error to getting job"})
    }
}

exports.add = async(req, res) => {
    try{
        let idContractor = req.user.sub
        let data = req.body

        //verificar que el id sea de un contractor
        let user = await User.findOne({_id: idContractor, role: "CONTRACTOR"})
        if(!user) return res.status(403).send({message: "Your not are a contractor"})

        data.contractor = idContractor 
        data.status = "Unassigned"
        let job = new Job(data)
        await job.save()
        
        return res.status(200).send({message: "Saved job successfully", data})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to saved job"})
    }
}

exports.update = async(req, res) => {
    try{
        let idContractor = req.user.sub
        let idJob = req.params.id
        let data = req.body

        //verificar que el trabajo exista
        let existJob = await Job.findOne({_id: idJob})
        if(!existJob) return res.status(404).send({message: 'Job not found'})        

        //verificar que no pueda actualizar el job de otros trabajadores 
        let job = await Job.findOne({_id: idJob, contractor: idContractor})
        if(!job) return res.status(403).send({message: 'You cannot update the work of other contractors'})
        let status = job.status
        console.log(status)

        //verificar que no este en InProgress or Completed
        if(status === "InProgress" || status === "Completed")
            return res.status(422).send({message: `Job is ${status}`})

        //actualizar job
        let updateJob = await Job.findOneAndUpdate(
            {_id: idJob},
            data,
            {new: true})
        if(!updateJob) return res.status(404).send({message: "Job not found and not updated"})    
        return res.status(200).send({message: "Job updated successfully", updateJob})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to updated job"})
    }
}

exports.delete = async(req, res) => {
    try{
        let idContractor = req.user.sub
        let idJob = req.params.id

        //verificar que el trabajo exista
        let existJob = await Job.findOne({_id: idJob})
        if(!existJob) return res.status(404).send({message: 'Job not found'})
        
        //verificar que no pueda eliminar el trabajo de otros trabajadores
        let job = await Job.findOne({_id: idJob, contractor: idContractor})
        if(!job) return res.status(403).send({message: "You cannot deleted the work of other contractors"})

        //cambiar lo estado de la peticiones a rejected

        //eliminar trabajo 
        let arr = job.requestWorkers
        for(let idArr of arr){
            await Request.findOneAndUpdate(
                {_id: idArr},
                {status: "Rejected"})
        }
        await Job.findOneAndDelete({_id: idJob})
        return res.status(200).send({message: "Job deleted successfully"})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to deleted job"})
    }
}