'use strict'

const express = require('express');
//Logs de las solicitudes que recibe el servidor
const morgan = require('morgan');
//Aplica seguridad básica al servidor
const helmet = require('helmet');
//Aceptación de solicitudes desde otro sistema o desde la misma máquina
const cors = require('cors');
//Instancia de express
const app = express();
const port = process.env.PORT || 3500;

// Routes
const userRoutes = require('../src/user/user.routes')
const oficioRoutes = require('../src/oficio/oficio.routes')
const paymentMethodRoutes = require('../src/paymentMethod/paymentMethod.routes')

//CONFIGURAR EL SERVIDOR HTTP DE EXPRESS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Ruta
app.use('/user', userRoutes)
app.use('/oficio', oficioRoutes)
app.use('/paymentMethod', paymentMethodRoutes)

//Función donde se levanta el servidor
exports.initServer = () => {
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}