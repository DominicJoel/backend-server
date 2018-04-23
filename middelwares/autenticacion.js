
var jwt = require('jsonwebtoken');//Estamos importando la libreria del webToken
var SEED = require('../config/config').SEED;//De config importamos lo que este exporta.


  // ======================================================
 //  Verificar token, esto es un middelware si no funciona aqui la que estan mas abajo no funcionaran
 // ======================================================
 

 exports.verificaToken = function (request, response,next) {//Una funcion para devolver si el token es valido o no
          
    var token = request.query.token; //Recibimos el token por la Url, pero no se obliga al usuario a poner un token si no que es opcional
    
    jwt.verify(token, SEED, (error , decoded) => {//Esta funcion es para verificar el token, le mandamos el token, el SEED que exportamos de config y su callback
          
     if(error){
             return response.status(401).json({//El 401 es e; Unauthorize
                     ok: false,//Un ok falso
                     mensaje: 'Token incorrecto',//Lo pondra en el postMan
                     errors : error //El mensaje de error que esta mandando
                     }); 
             }
                   
             decoded.usuario.password = "*******";//Para no mostrar la password encriptada
             request.usuario = decoded.usuario;//Ya con esto donde sea que llamemos esta funcion tendremos la informacion del usuario que hizo la solicitud
       
           next();//Con esto le decimos que puede seguir con las funciones que esten mas abajo 

    });

   }


 


