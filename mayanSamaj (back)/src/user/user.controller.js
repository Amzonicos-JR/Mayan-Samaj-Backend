'use strict'
const User = require('./user.model');
// const Job = require('../job/job.model');
const fs = require('fs')
const {validateData, encrypt, checkPassword}= require('../utils/validate')
const { createToken } = require ('../services/jwt')
const userInfo = [ 'name', 'surname', 'phone', 'email', 'role' ]
const path = require('path')

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

'[Contractor]'
exports.registerContractor = async(req, res)=>{
    try{
        //Obtener la información a agregar
        let data = req.body;
        //Validar que el email no se repita
        // let users = await User.find();
        // if(data.email == users.email) return res.send({message: 'Email duplicated'})
        data.role = 'CONTRACTOR';
        data.password = await encrypt(data.password);
        let email = data.email;
        let existUser = await User.findOne({email: email}); 
        if(existUser){
            return res.status(400).send({message: 'El email ya se encuentra registrado'});
        }
        let user = new User(data);
        await user.save();
        return res.status(201).send({message: 'User registered succesfully',user});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error registered user'});
    }
}

exports.getC = async(req, res)=>{
    try{
        //Buscar datos
        let contractors = await User.find({role: 'CONTRACTOR'});
        return res.send({message: 'Contractors found', contractors});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting workers'});
    }
}

'[Worker]'
exports.registerWorker = async(req, res)=>{
    try{
        //Obtener la información a agregar
        let data = req.body;
        //Validar que el email no se repita
        // let users = await User.find();
        // if(data.email == users.email) return res.send({message: 'Email duplicated'})
        data.role = 'WORKER';
        data.password = await encrypt(data.password);
        let email = data.email;
        let existUser = await User.findOne({email: email}); 
        if(existUser){
            return res.status(400).send({message: 'El email ya se encuentra registrado'});
        }
        let user = new User(data);
        await user.save();
        return res.status(201).send({message: 'User registered succesfully',user});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error registered user'});
    }
}


exports.getW = async(req, res)=>{
    try{
        //Buscar datos
        let workers = await User.find({role: 'WORKER'});
        return res.send({message: 'Workers found', workers});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting workers'});
    }
}


exports.updateAccount = async(req, res)=>{
    try{
        //obtener el Id a actualizar
        let id = req.user.sub;
        //obtener la data a actualizar
        let data = req.body;
        //Validar datos a actualizar
        let params = {
            email: data.email,
            password: data.password
        }
        let validate = validateData(params);
        if(validate) return res.status(400).send(validate);
        //Validar que exista la categoría
        let existU = await User.findOne({_id: id});
        if(!existU) return res.status(404).send({message: 'User not found'});
        //Actualizar
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.send({message: 'User not found and not updated'});
        return res.send({message: 'User updated:', updatedUser});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating product'});
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        let idUser = req.params.id;
        let userJob = await Job.findOne({user: idUser})
        // if(userJob){
        //     return res.status(400).send({message: 'User has jobs'});
        // }else{
            let deletedUser = await User.findOneAndDelete({_id: idUser});
            if(!deletedUser) return res.status(404).send({message: 'Error removing user or already deleted'});
            return res.send({message: 'user deleted sucessfully', deletedUser});
        // }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error removing user'})
    }
}

// Tema de la imagen
exports.addImage = async(req, res)=>{
    try{
        //obtener el id del usuario al cual se va a vincular la imagen, por medio del token si se loggea
        let idUser = req.user._id;
        //const productId = req.params.id; 
        //si es un usuario, y está logeado se puede jalar del token

        const alreadyImage = await User.findOne({_id: idUser})
        let pathFile = './uploads/users/'
        if(alreadyImage.image) fs.unlinkSync(`${pathFile}${alreadyImage.image}`) //./uploads/products/nombreImage.png
        if(!req.files.image || !req.files.image.type) return res.status(400).send({message: 'Havent sent image'})
        //crear la ruta para guardar la imagen
        const filePath = req.files.image.path; // \uploads\products\productName.png
        //Separar en jerarqu´+ia la ruta de imagen (linux o MAC ('\'))
        const fileSplit = filePath.split('\\') //fileSplit = ['uploads', 'products', 'productName.png']
        const fileName = fileSplit[2];

        const extension = fileName.split('\.'); //extension = ['productName', 'png']
        const fileExt = extension[1] // fileExt = 'png'
        console.log(fileExt)
        if(
            fileExt == 'png' || 
            fileExt == 'jpg' || 
            fileExt == 'jpeg' || 
            fileExt == 'gif'
        ){
            const updatedUser = await User.findOneAndUpdate(
                {_id: idUser}, 
                {image: fileName}, 
                {new: true}
            )
            if(!updatedUser) return res.status(404).send({message: 'User not found and not updated'});
            return res.send({message: 'User updated', updatedUser})
        }
        fs.unlinkSync(filePath)
        return res.status(404).send({message: 'File extension cannot admited'});
        

    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding image', err})
    }
}

exports.getImage = async(req, res)=>{
    try{
        const fileName = req.params.fileName;
        const pathFile = `./uploads/users/${fileName}`

        const image = fs.existsSync(pathFile);
        if(!image) return res.status(404).send({message: 'image not found'})
        return res.sendFile(path.resolve(pathFile))
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting image'});
    }
}