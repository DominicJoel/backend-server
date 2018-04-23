var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],//Para que no nos creen los usuarios que ellos quieran
    message: '{VALUE} no es un rol permitido'
}


var usuarioSchema = new Schema({//Este es el esquema del usuario, debe ser igual que la BD

    nombre: { type:String, required: [true, "El nombre es necesario" ]},//Esto ayudara a Mongoose a decirle el tipo y verificar si es obligatorio o no
    apellido: { type:String, required: [true, "El apellido es necesario" ]},
    email: { type:String, unique:true ,required: [true, "El correo es necesario " ]},
    password: { type:String, required: [true, "La contraseña es necesaria" ]},
    img: { type:String, required: false },
    role: { type: String, require: true, default: 'USER_ROLE', enum: rolesValidos}//El default es para darle un valor por defecto 
    
    
});

usuarioSchema.plugin( uniqueValidator, { message: 'El {PATH} debe de ser unico' } );//Para que no aparezca un error largo y extraño

module.exports = mongoose.model('Usuario', usuarioSchema);//Ya tenemos hecho un esquemas con validaciones