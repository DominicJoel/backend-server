var express = require('express');

var jwt = require('jsonwebtoken');//Estamos importando la libreria del webToken
//var SEED = require('../config/config').SEED;//De config importamos lo que este exporta.

 var mdAutenticacion = require('../middelwares/autenticacion');//Aqui esta la funcion que verifica el token

var app = express();
var bcrypt = require('bcryptjs');//Estamos importando lo que nos ayudara a encriptar la contraseña
var Usuario = require('../models/usuario');//Para importar el esqueme o modelo de Usuarios


// ================================================
// Obtener todos los usuarios
// ================================================

app.get('/', (request , response, next) =>{ //En este callback recibimos el response(respuesta) desde el servidor, request los datos que esta mandando
  
      Usuario.find({ }, 'nombre email img role') //('nombre email img role) eso es para filtra solo esos elementos las password no la mostrara
        .exec(
                (error, usuarios) => { //De este callback recibimos un error o todos los usuarios 
                
                if(error){
                        return response.status(400).json({
                                ok: false,//Un ok falso
                                mensaje: 'Erros cargando usuarios',//Lo pondra en el postMan
                                errors : error //El mensaje de error que esta mandando
                                }); 
                        }
                        response.status(200).json({//INDICA QUE TODO esta funcionando bn
                        ok: true,
                        usuario: usuarios
                })
        
        })//Es algo de moongose para buscar todos los elementos 
        
        }) //Esto es para aplicar la rutas, tiene su (/) para ir al principal y contiene un (request , response, next)



// ================================================
// Actualizar un usuario
// ================================================

app.put('/:id', mdAutenticacion.verificaToken,(request, response) => {//Como estamos actualizando le mandamos el id del usuario para que lo actualize

   
    var id = request.params.id;//Esto captura el id que estamos mandando en el parametro y (id) es el mismo nombre que le pusimos al parametro
    var body = request.body;//Esto agarra toda la informacion obtenida 


    Usuario.findById(id, (error, usuario) =>{//En este callback recibimos o un error o una respuesta correcta con el usuario , todos los metodos de mongoose sus callback siempre tienen un (error o una respuesta), el findbyId es un metodo de moongose para encontrarlo
         

        if (error){
                return response.status(500).json({//Cuando retornamos con el return un error , al mismo tiempo destruye la funcion y no sigue corriendo
                        ok: false,//Un ok falso
                        mensaje: 'Error al buscar el usuario',//Lo pondra en el postMan
                        errors : error //El mensaje de error que esta mandando
                        });  
                }
            
        if( !usuario ){ //Si no encuentra un usuario
             return response.status(400).json({//Cuando retornamos con el return un error , al mismo tiempo destruye la funcion y no sigue corriendo
                  ok: false, //Un ok falso
                  mensaje: 'El usuario con el id:'+ id +  'no existe. ',//Lo pondra en el postMan
                  errors : { message: 'No existe un usuario con ese ID'}
                  });  
         }        

        
         //Si no entra en ninguna de la condiciones anteriores va a ejecutar esto que es lo que actualizara
         usuario.nombre = body.nombre;
         usuario.apellido = body.apellido;
         usuario.email = body.email;
         usuario.role =  body.role;


         usuario.save ( ( error, usuariosActualizado )=>{//Para guardar el cambio
                
                if (error){
                        return response.status(400).json({//Cuando retornamos con el return un error , al mismo tiempo destruye la funcion y no sigue corriendo
                                ok: false,//Un ok falso
                                mensaje: 'Error al actualizar el usuario',//Lo pondra en el postMan
                                errors : error //El mensaje de error que esta mandando
                                });  
                        }

                usuariosActualizado.password = '*******';//Para que no muestre la password encriptada, no cambiara la password porque esta dentro del callback del (save) por lo que no lo va a cambiar solo es para mostrarlo 

                response.status(200).json({//Indica que fue actualizado correctamente
                        ok: true,
                        usuario: usuariosActualizado,
                        usuarioQueActualiza: request.usuario //Aqui capturamos el valor que el request tiene en la funcion (verificar Token)
                         
                })//Fin del status 200

         });

    });//Fin del FindById    


});   



// ================================================
// Crear un nuevo usuario
// ================================================

app.post('/', mdAutenticacion.verificaToken, (request,response) => {// (mdAutenticacion.verificaToken) esa es la funcion que verifica el token, la llamamos aqui como un segundo parametro y listo

     var body = request.body; //El (request.body) al menos que el middelware del body parser este funcionando, el no funcioanara
    
     var usuario = new Usuario({
         nombre: body.nombre,//El body es el lo mismo que el request o lo que recibimos de datos
         apellido: body.apellido,
         email: body.email,
         password: bcrypt.hashSync( body.password, 10 ),//Estamos encriptando la contraseña
         img:body.img,
         role:body.role
     }); 

       usuario.save( (error, usuarioGuardado) =>{ //Para guardar los datos
                 
              if (error){
                        return response.status(400).json({
                                ok: false,//Un ok falso
                                mensaje: 'Error al crear usuario',//Lo pondra en el postMan
                                errors : error //El mensaje de error que esta mandando
                                });  
                        }
                
                  usuarioGuardado.password = "******";       
               
                  response.status(201).json({//Indica que fue creado bien
                        ok: true,
                        usuario: usuarioGuardado, //Lo que se guardo
                        usuarioCreador: request.usuario //Aqui capturamos el valor que el request tiene en la funcion (verificar Token)
                })//Fin del status 200
       });
});//Find del post


// ======================================================
//  Borrar usuario por el Id
// ======================================================

app.delete('/:id', mdAutenticacion.verificaToken, (request,response) => {
  
  var id = request.params.id;//Esto captura el id que estamos mandando en el parametro y (id) es el mismo nombre que le pusimos al parametro
  
  Usuario.findByIdAndRemove(id, (error, usuarioBorrado) =>{
        
   

        if (error){
                return response.status(500).json({
                        ok: false,//Un ok falso
                        mensaje: 'Error al borrar usuario',//Lo pondra en el postMan
                        errors : error //El mensaje de error que esta mandando
                        });  
                }
                
        if (!usuarioBorrado ){//Verificar que exista
                return response.status(500).json({
                                ok: false,//Un ok falso
                                mensaje: 'No existe este usuario',//Lo pondra en el postMan
                                errors : { mensaje: " El usuario con el id: " + id + " no existe "  }
                                });  
                        }
                 
        usuarioBorrado.password = '*******';//Para que no vean la password encriptada

        response.status(200).json({//Indica que fue creado bien
                ok: true,
                usuario: usuarioBorrado, //Lo que se borro
                usuarioQueLoBorro: request.usuario //Aqui capturamos el valor que el request tiene en la funcion (verificar Token)
                
                
        })//Fin del status 200

  })//Fin del callback

})//FIn del Delete

module.exports = app;