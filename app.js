'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//==========================
//  cargar archivos de rutas
//==========================



//============
//  middleware
//============
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//======
//  CORS
//======



//=======
//  rutas
//=======
app.get('/', (req, res) =>{
    res.status(200).send(
        "<h1>Página de inicio</h1>"
    );
});

app.post('/test/:id', (req, res) =>{
    console.log(req.query.web);    
    console.log(req.body.name);
    console.log(req.params.id);
    
    res.status(200).send({
        menssage: "Hola mundo desde API en nodeJS"
    });
});


//==========
//  exportar
//==========
module.exports = app;