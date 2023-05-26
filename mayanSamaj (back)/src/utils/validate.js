'use strict'

// Validaciones, encript, comparaciones de encript
const bcrypt = require('bcrypt');

exports.encrypt = async(password)=>{
    try {
        return await bcrypt.hash(password,10);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.validateData = (data)=>{
    let keys = Object.keys(data), msg = '';
    for(let key of keys){
        if(data [key] !== null &&
            data [key] !== undefined &&
            data [key] !== '') continue; 
        return msg += `params ${key} is required\n`
    }
}

exports.checkPassword = async(password, hash)=>{
    try {
        return await bcrypt.compare(password, hash)
    } catch (err) {
        console.error(err);
        return false;
    }
}