
var express = require('express');//Para poder conectarnos
var bcrypt = require('bcryptjs');//Estamos importando lo que nos ayudara a encriptar la contraseña
var jwt = require('jsonwebtoken');//Estamos importando la libreria del webToken


var SEED = require('../config/config').SEED;//De config importamos lo que este exporta. 
var app = express(); //Levantamos la variable del express
var Usuario = require('../models/usuario');//Para importar el esqueme o modelo de Usuarios


app.post('/', (request,response) =>{
  
    var body = request.body; //El (request.body) al menos que el middelware del body parser este funcionando, el no funcioanara
   
    Usuario.findOne( { email:body.email }, (error, UsuarioDB)=>{ //El finfOne es un metodo de moongose donde primero nos aseguramos que debe existir un email
            
        
        if(error){
            return response.status(500).json({
                ok: false,//Un ok falso
                mensaje: 'Error al buscar usuario',//Lo pondra en el postMan
                errors : error //El mensaje de error que esta mandando
                });  
        }

        if(!UsuarioDB){//Si no existe usuario
            return response.status(400).json({
                ok: false,//Un ok falso
                mensaje: 'Credenciales incorrectas - email',//Lo pondra en el postMan
                errors : error //El mensaje de error que esta mandando
                });  
        }

        if ( !bcrypt.compareSync( body.password, UsuarioDB.password ) ) {
            return response.status(500).json({
                ok: false,//Un ok falso
                mensaje: 'Credenciales incorrectas - password',//Lo pondra en el postMan
                errors : error //El mensaje de error que esta mandando
                });   
        
        }//Este metodo lo que hace es comparar la passwords de BD con la que estamos mandando a ver si son iguales, esto devuelve un booleano, un true si es contrario o un false si no lo es

        //Crear Token
        var token =  jwt.sign({ usuario: UsuarioDB }, SEED, { expiresIn: 14400 }); // Para generar un token, primero le asignamos a usuario el valor que trae UsuarioDB, luego le hacemos un Seed para que sea unico podemos poner lo que querramos pero que sea dificil y por ultimo ponemos la expiracion del token en este caso le psuimos 4 horas 
       
         UsuarioDB.password = "*****";

        response.status(200).json({//Indica que fue creado bien
            ok: true,
            usuario: UsuarioDB,
            token: token,
            id: UsuarioDB._id
        });//Fin del status 200

    });//Fin del findOne
  
});//Find del Post


module.exports = app;