// Requires
var express = require('express');
var mongoose = require('mongoose');//Hacemos referencia a la libreria

//Inicializar variables
var app = express();

//Conexion a la Base de Datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',(err, res) =>{
              
        if (err)  throw err;//Si no funciona, no hara nada y mostrara un error
        
        console.log("Base de Datos Works 3000: \x1b[32m%s\x1b[0m"," online");//De lo contrario mostrara esto
}) 


//Rutas
app.get('/', (request , response, next) =>{
    
      response.status(200).json({
            ok: true,
            mensaje: 'peticion realizada correctamente'
      })

}) //Esto es para aplicar la rutas, tiene su (/) para ir al principal y contiene un (request , response, next)



//Escuchar peticiones
app.listen(3000 , ()=>{
      console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m"," online");//(\x1b[32m%s\1xb[0m) ese codigo es para ponerlo de un color 
})//Para que escuche el puerto 3000