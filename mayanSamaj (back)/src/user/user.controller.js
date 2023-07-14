'use strict'
const User = require('./user.model');
const Job = require('../job/job.model');
const fs = require('fs')
const {validateData, encrypt, checkPassword}= require('../utils/validate')
const { createToken } = require ('../services/jwt')
const userInfo = [ 'name', 'surname', 'phone', 'email', 'role' ]
const path = require('path')

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

exports.register = async(req, res)=>{
    try{
        //Obtener la información a agregar
        let data = req.body;
        //validar que el email de el usuario no se repita
        let params={
            password: data.password
        }
        let validate = validateData(params);
        if(validate) return res.status(400).send(validate);
        data.role = 'CONTRACTOR';
        data.password = await encrypt(data.password);
        let email = data.email;
        let existUser = await User.findOne({email: email}); 
        if(existUser){
            return res.status(400).send({message: 'El email ya se encuentra registrado'});
        }
        let user = new User(data);
        await user.save();
        return res.status(201).send({message: 'User created succesfully',user});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating user'});
    }
}

exports.getProducts = async(req, res)=>{
    try{
        //Buscar datos
        let products = await Product.find().populate('category');
        return res.send({message: 'Products found', products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.getProduct = async(req, res)=>{
    try{
        //Obtener el Id del producto a buscar
        let productId = req.params.id;
        //Buscarlo en BD
        let product = await Product.findOne({_id: productId}).populate('category');
        //Valido que exista el producto
        if(!product) return res.status(404).send({message: 'Product not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Product found:', product});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting product'});
    }
}

exports.updateProduct = async(req, res)=>{
    try{
        //obtener el Id del producto
        let productId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        //Validar que exista la categoría
        let existCategory = await Category.findOne({_id: data.category});
        if(!existCategory) return res.status(404).send({message: 'Category not found'});
        //Actualizar
        let updatedUser = await Product.findOneAndUpdate(
            {_id: productId},
            data,
            {new: true}
        )
        if(!updatedUser) return res.send({message: 'Product not found and not updated'});
        return res.send({message: 'Product updated:', updatedUser});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating product'});
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        let idUser = req.params.id;
        let userJob = await Job.findOne({user : idUser})
        if(userJob){
            return res.status(400).send({message: 'User has jobs'});
        }else{
            let deletedUser = await User.findOneAndDelete({_id: idUser});
            if(!deletedUser) return res.status(404).send({message: 'Error removing user or already deleted'});
            return res.send({message: 'user deleted sucessfully', deletedUser});
        }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error removing user'})
    }
}

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