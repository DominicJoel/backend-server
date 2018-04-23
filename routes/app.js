var express = require('express');


var app = express();

//Rutas
app.get('/', (request , response, next) =>{
    
    response.status(200).json({
          ok: true,
          mensaje: 'peticion realizada correctamente'
    })

}) //Esto es para aplicar la rutas, tiene su (/) para ir al principal y contiene un (request , response, next)


module.exports = app;