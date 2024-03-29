'use strict'
const Email = require('./email.model')
const User = require('../user/user.model')
//const infoUser = '-_id -phone -email -password -role'

// Enviar emails
exports.sendEmail = async (req, res) => {
    try {
        let data = req.body;
        let idUser = req.params.id
        let user = await User.findOne({ _id: idUser }).select('email')
        let userFor = await User.findOne({ email: data.forPerson });
        if (!userFor) return res.send({ message: 'User not found :/' })
        data.from = user.email;
        let fecha = new Date();
        data.date = fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace('.', ',');
        let email = new Email(data)
        await email.save()
        return res.status(200).send({ message: 'email sent' })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error send email :/' })
    }
}

// Emails por usuario
exports.getByUser = async (req, res) => {
    try {
        let idUser = req.params.id;
        let user = await User.findOne({ _id: idUser }).select('email');
        console.log(user)
        let email = await Email.find({
            $or: [
                { from: user.email },
                { forPerson: user.email },
            ],
        });
        if (!email) return res.send({ message: 'Empty email' })
        return res.send({ message: 'Emails: ', email });
    } catch (err) {
        console.error(err)
        return res.send({ message: 'Error getting emails' })
    }
}
// Ver todos los emails
exports.seeEmail = async (req, res) => {
    try {
        let idEmail = req.params.id;
        let email = await Email.find({ _id: idEmail })
        return res.send({ message: 'Email: ', email });
    } catch (error) {
        console.err(error)
        return res.send({ message: 'Error getting email' })
    }
}