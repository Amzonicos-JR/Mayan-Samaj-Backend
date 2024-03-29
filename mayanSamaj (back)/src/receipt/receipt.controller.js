'use strict'
const Receipt = require('./receipt.model')
const Job = require('../job/job.model')
const User = require('../user/user.model')
const infoUser = '-_id -phone -email -password -role'

exports.generateReceipt = async (req, res) => {
    try {
        let data = req.body;
        let idJob = req.params.id;
        let jobG = await Job.findOne({ _id: idJob });
        //Verificar que no se duplique el recibo
        let existReceipt = await Receipt.findOne({ jobDescription: jobG.description });
        if (existReceipt) return res.send({ message: 'receipt exist!' })
        let user = await User.findOne({ _id: jobG.contractor }).select(infoUser)
        data.contractor = user.name + ' ' + user.surname;
        data.totalPay = jobG.price;
        data.jobDescription = jobG.description;
        let receipt = new Receipt(data)
        await receipt.save()
        return res.status(200).send({ message: 'sucessfully, check receipt' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error generate receipt :/' })
    }
}

exports.getByUser = async (req, res) => {
    try {
        let idContractor = req.params.id;
        let user = await User.findOne({ _id: idContractor });
        let receipt = await Receipt.find({ contractor: user.name + ' ' + user.surname });
        return res.send({ message: 'Receipts: ', receipt })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting receipt' });
    }

}