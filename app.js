// Requires
var express = require('express');
var mongoose = require('mongoose');//Hacemos referencia a la libreria
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))//Estos middelware es para que convierta al momento de hacer un post el objeto a uno de java script para leerlo en estos dos formatos
app.use(bodyParser.json())


//Rutas

var appRoutes =  require('./routes/app')//Importamos lo que exporta el route app
var usuarioRoutes =  require('./routes/usuario')//Importamos lo que exporta el route usuario
var loginRoutes =  require('./routes/login')//Importamos lo que exporta el route login



//Conexion a la Base de Datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',(err, res) =>{
              
        if (err)  throw err;//Si no funciona, no hara nada y mostrara un error
        
        console.log("Base de Datos Works 3000: \x1b[32m%s\x1b[0m"," online");//De lo contrario mostrara esto
}) 


//Rutas
app.use('/usuario',usuarioRoutes);//Le mandamos junto a (/) lo que trae el appRoutes asi usa esa url para el manejo de datos
app.use('/login',loginRoutes);//Le mandamos junto a (/) lo que trae el appRoutes asi usa esa url para el manejo de datos
app.use('/',appRoutes);//Le mandamos junto a (/) lo que trae el appRoutes


//Escuchar peticiones
app.listen(3000 , ()=>{
       console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m"," online");//(\x1b[32m%s\1xb[0m) ese codigo es para ponerlo de un color 
})//Para que escuche el puerto 3000