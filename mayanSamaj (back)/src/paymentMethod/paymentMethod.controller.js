'use strict'

const PaymentMethod = require('./paymentMethod.model')

// Funcion test
exports.test = (req, res) => {
    res.send({ message: 'Test function is running PaymentMethod' });
}

// Add PaymentMethod
exports.addPaymentMethod = async (req, res) => {
    try {
        let data = req.body;
        //Validar duplicados
         let existPaymentMethod = await PaymentMethod.findOne({name: data.name});
        if(existPaymentMethod) return res.status(404).send({message: 'PaymentMethod already existed'}) 
        // save
        let paymentMethod = new PaymentMethod(data);
        await paymentMethod.save();
        return res.send({ message: 'PaymentMethod created sucessfully', paymentMethod });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error Creating PaymentMethod' })
    }
}

exports.getPaymentMethods = async(req, res)=>{
    try{
        //Buscar datos
        let paymentMethods = await PaymentMethod.find();
        return res.send({message: 'PaymentMethod found', paymentMethods});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting PaymentMethods'});
    }
}


exports.getPaymentMethod = async(req, res)=>{
    try{
        //Obtener el Id del producto a buscar
        let paymentMethodId = req.params.id;
        //Buscarlo en BD
        let paymentMethod = await PaymentMethod.findOne({_id: paymentMethodId});
        //Valido que exista el producto
        if(!paymentMethod) return res.status(404).send({message: 'PaymentMethod not found'});
        //Si existe lo devuelvo
        return res.send({message: 'PaymentMethod found:', paymentMethod});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting paymentMethod'});
    }
}

exports.updatePaymentMethod = async(req, res)=>{
    try{
        //obtener el Id del producto
        let paymentMethodId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        
        //Actualizar
        let updatePaymentMethod = await PaymentMethod.findOneAndUpdate(
            {_id: paymentMethodId},
            data,
            {new: true}
        )
        if(!updatePaymentMethod) return res.send({message: 'PaymentMethod not found and not updated'});
        return res.send({message: 'PaymentMethod updated:', updatePaymentMethod});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating product'});
    }
}

// Delete PaymentMethod
exports.deletePaymentMethod = async (req, res) => {
    try {
        //Obtener el id a eliminar
        let paymentMethodId = req.params.id;
        //Eliminar el usuario
        let paymentMethodDeleted = await PaymentMethod.findOneAndDelete({ _id: paymentMethodId });
        if (!paymentMethodDeleted) return res.send({ message: 'PaymentMethod not found and not deleted' });
        return res.send({ message: `PaymentMethod with username ${paymentMethodDeleted.name} deleted sucessfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}