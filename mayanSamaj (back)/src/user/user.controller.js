    'use strict'
const User = require('./user.model');
// const Job = require('../job/job.model');
const fs = require('fs')
const { validateData, encrypt, checkPassword } = require('../utils/validate')
const { createToken } = require('../services/jwt')
const userInfo = ['name', 'surname', 'phone', 'email', 'role']
const path = require('path')

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

// Admin App
exports.adminAM = async (req, res) => {
    try {
        let existsUser = await User.findOne({ name: 'amzonico' })
        if (existsUser) return console.log('Admin already created');

        let data = {
            name: 'AMZONICO',
            surname: 'JR',
            phone: 'X',
            email: 'AMZ@gmail.com',
            password: '123',
            role: 'ADMINAM'
        }
        data.password = await encrypt(data.password)
        let defaultAM = new User(data);
        await defaultAM.save();
        return console.log('Admin created sucessfully')
    } catch (err) {
        console.log(err);
    }
}



'[Contractor]'
exports.registerContractor = async (req, res) => {
    try {
        //Obtener la información a agregar
        let data = req.body;
        //Validar que el email no se repita
        let emailExist = await User.findOne({ email: data.email });
        if (emailExist) return res.send({ message: 'Email duplicated' })
        // Validar No Telefono
        if (data.phone.length != 8) return res.send({ message: 'No.phone not valid' })
        data.role = 'CONTRACTOR';
        data.password = await encrypt(data.password);
        let email = data.email;
        let existUser = await User.findOne({ email: email });
        if (existUser) {
            return res.status(400).send({ message: 'El email ya se encuentra registrado' });
        }
        let user = new User(data);
        await user.save();
        return res.status(201).send({ message: 'User registered succesfully', user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registered user' });
    }
}

exports.getC = async (req, res) => {
    try {
        //Buscar datos
        let contractors = await User.find({ role: 'CONTRACTOR' });
        return res.send({ message: 'Contractors found', contractors });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting workers' });
    }
}

'[Worker]'
exports.registerWorker = async (req, res) => {
    try {
        //Obtener la información a agregar
        let data = req.body;
        //Validar que el email no se repita
        let emailExist = await User.findOne({ email: data.email });
        if (emailExist) return res.send({ message: 'Email duplicated' })
        // Validar No Telefono
        if (data.phone.length != 8) return res.send({ message: 'No.phone not valid' })
        data.role = 'WORKER';
        data.password = await encrypt(data.password);
        let email = data.email;
        let existUser = await User.findOne({ email: email });
        if (existUser) {
            return res.status(400).send({ message: 'El email ya se encuentra registrado' });
        }
        let user = new User(data);
        await user.save();
        return res.status(201).send({ message: 'User registered succesfully', user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registered user' });
    }
}


exports.getW = async (req, res) => {
    try {
        //Buscar datos
        let workers = await User.find({ role: 'WORKER' });
        return res.send({ message: 'Workers found', workers });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting workers' });
    }
}

// Login
exports.login = async (req, res) => {
    try {
        let data = req.body;
        let credentials = {
            email: data.email,
            password: data.password
        }
        let msg = validateData(credentials);
        if (msg) return res.status(400).send(msg)
        let user = await User.findOne({ email: data.email });
        if (user && await checkPassword(data.password, user.password)) {
            let userLogged = {
                _id: user.id,
                role: user.role
            }
            let token = await createToken(user)
            return res.send({ message: 'User logged sucessfully', token, userLogged });
        }
        return res.status(401).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error, not logged' });
    }
}

// Image


exports.updateAccount = async (req, res) => {
    try {
        //obtener el Id de su cuenta 
        let id = req.user.sub;
        //obtener la data a actualizar
        let data = req.body;
        //Validar datos a actualizar
        if (data.email || data.password) return res.send({ message: 'Data not updateable' })
        // Validar No Telefono
        if (data.phone.length != 8) return res.send({ message: 'No.phone not valid' })
        //Validar que exista el usuario
        let existU = await User.findOne({ _id: id });
        if (!existU) return res.status(404).send({ message: 'User not found' });
        //Actualizar
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatedUser) return res.send({ message: 'User not found and not updated' });
        return res.send({ message: 'User updated:', updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating product' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        let idUser = req.params.id;
        let userJob = await Job.findOne({ user: idUser })
        // if(userJob){
        //     return res.status(400).send({message: 'User has jobs'});
        // }else{
        let deletedUser = await User.findOneAndDelete({ _id: idUser });
        if (!deletedUser) return res.status(404).send({ message: 'Error removing user or already deleted' });
        return res.send({ message: 'user deleted sucessfully', deletedUser });
        // }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error removing user' })
    }
}

exports.getProfile = async (req, res) => {
    try {
        //let userId = req.params.id;
        let user = await User.findOne({ _id: req.user.sub })
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'User found', user: user })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting user' });
    }
}

exports.updatePassword = async (req, res) => {
    try {
        let data = req.body;
        //let userId = req.params.id;
        let user = await User.findOne({ _id: req.user.sub });
        if (await checkPassword(data.password, user.password)) {
            console.log(user.password, 'sxf')
            if (Object.entries(data).length === 0) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
            let newPassword = await encrypt(data.newPassword);
            let updatePassword = await User.findOneAndUpdate(
                { _id: req.user.sub },
                { password: newPassword },
                { new: true }
            );
            if (!updatePassword)
                return res
                    .status(404)
                    .send({ message: "User not found and password not updated" });
            return res.send({
                message: "The password has been successfully updated",
                updatePassword
            });
        } else {
            return res.status(400).send({ message: "Passwords do not match" });
        }
    } catch (err) {
        console.error(err);
        return res.send({ message: "Error, could not update password" });
    }
};

exports.updateEmail = async (req, res) =>{
    try{
    let data = req.body;
        //let userId = req.params.id;
        let user = await User.findOne({ _id: req.user.sub });
        if (await checkPassword(data.password, user.password)) {
            if (Object.entries(data).length === 0) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
            let updateEmail = await User.findOneAndUpdate(
                { _id: req.user.sub },
                { email: data.newEmail },
                { new: true }
            );
            if (!updateEmail)
                return res
                    .status(404)
                    .send({ message: "User not found and email not updated" });
            return res.send({
                message: "The email has been successfully updated",
                updateEmail
            });
        } else {
            return res.status(400).send({ message: "Password do not match" });
        }
    } catch (err) {
        console.error(err);
        return res.send({ message: "Error, could not update email" });
    }
}

// --------------------------------------------------- [Tema de la imagen] ---------------------------------------------------

exports.addImage = async (req, res) => {
    try {
        //obtener el id del usuario al cual se va a vincular la imagen, por medio del token si se loggea
        let idUser = req.user.sub; //si es un usuario, y está logeado se puede jalar del token
        const alreadyImage = await User.findOne({ _id: idUser })
        // Acá estaran almacenadas las img
        let pathFile = './uploads/users/'
        if (alreadyImage.image) fs.unlinkSync(`${pathFile}${alreadyImage.image}`) //./uploads/users/nombreImage.png
        if (!req.files.image || !req.files.image.type) return res.status(400).send({ message: 'Havent sent image' })
        //Crear la ruta para guardar la imagen
        const filePath = req.files.image.path; // \uploads\users\userName.png
        //Separar en jerarquia la ruta de imagen (linux o MAC ('\'))
        const fileSplit = filePath.split('\\') //fileSplit = ['uploads', 'users', 'userName.png']
        const fileName = fileSplit[2];
        // Validar las extensiones
        const extension = fileName.split('\.'); //extension = ['userName', 'png']
        const fileExt = extension[1] // fileExt = 'png'
        console.log(fileExt)
        if (
            fileExt == 'png' ||
            fileExt == 'jpg' ||
            fileExt == 'jpeg' ||
            fileExt == 'gif'
        ) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: idUser },
                { image: fileName },
                { new: true }
            )
            if (!updatedUser) return res.status(404).send({ message: 'User not found and not updated' });
            return res.send({ message: 'User updated', updatedUser })
        }
        fs.unlinkSync(filePath)
        return res.status(404).send({ message: 'File extension cannot admited' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding image', err })
    }
}
exports.getImage = async (req, res) => {
    try {
        // Obtener el id generado de la imagen
        const fileName = req.params.fileName;
        const pathFile = `./uploads/users/${fileName}`
        // Verificar que exista la imagen
        const image = fs.existsSync(pathFile);
        if (!image) return res.status(404).send({ message: 'Image not found' })
        return res.sendFile(path.resolve(pathFile))
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting image' });
    }
}