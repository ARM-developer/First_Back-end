'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3700;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio')
                .then(() => {
                    console.log("Conexion a la base datos establecida con exito...");    
                    //======================
                    // creacion del servidor
                    //======================
                    app.listen(port, () => {
                        console.log("Servidor corriendo correctamente en la url http://localhost:" + port);                        
                    });
                })
                .catch( err => console.log(err));