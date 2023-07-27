'use strict'

const Oficio = require('./oficio.model');

// Funcion test
exports.test = (req, res) => {
    res.send({ message: 'Test function is running Oficio' });
}

// Add Oficio
exports.addOficio = async (req, res) => {
    try {
        let data = req.body;
        //Validar duplicados
         let existOficio = await Oficio.findOne({name: data.name});
        if(existOficio) return res.status(404).send({message: 'Oficio already existed'}) 
        // save
        let oficio = new Oficio(data);
        await oficio.save();
        return res.send({ message: 'Oficio created sucessfully', oficio });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error Creating Oficio' })
    }
}

exports.getOficios = async(req, res)=>{
    try{
        //Buscar datos
        let oficios = await Oficio.find();
        return res.send({message: 'Oficios found', oficios});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting Oficios'});
    }
}


exports.getOficio = async(req, res)=>{
    try{
        //Obtener el Id del producto a buscar
        let oficioId = req.params.id;
        //Buscarlo en BD
        let oficio = await Oficio.findOne({_id: oficioId});
        //Valido que exista el producto
        if(!oficio) return res.status(404).send({message: 'Oficio not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Oficio found:', oficio});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting oficio'});
    }
}

exports.updateOficio = async(req, res)=>{
    try{
        //obtener el Id del producto
        let oficioId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        
        //Actualizar
        let updateOficio = await Oficio.findOneAndUpdate(
            {_id: oficioId},
            data,
            {new: true}
        )
        if(!updateOficio) return res.send({message: 'Oficio not found and not updated'});
        return res.send({message: 'Oficio updated:', updateOficio});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating Oficio'});
    }
}

// Delete Oficio
exports.deleteOficio = async (req, res) => {
    try {
        //Obtener el id a eliminar
        let oficioId = req.params.id;
        //Eliminar el usuario
        let oficioDeleted = await Oficio.findOneAndDelete({ _id: oficioId });
        if (!oficioDeleted) return res.send({ message: 'Oficio not found and not deleted' });
        return res.send({ message: `Oficio with username ${oficioDeleted.name} deleted sucessfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}