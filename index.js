// instancio todas las dependencias a usar en el API.
var express = require('express');
var sql = require('mssql');
var cors = require('cors');
var bodyparser = require('body-parser');
var env = require('dotenv');

// Almaceno toda la funcionalidad del espress en la variable app.
var app = express();


const result = env.config();
// Ejecuto las funciones
app.use(cors());
app.use(bodyparser());

// creao una variable que almacenara la funcion de configuracion d acceso a la base detos.
const sqlconfig={
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false
    }
}


// Crear la funcion que me atrapará errores.
app.use(function(err, req, res, next){
    console.log(err);
    res.send({success: false, message: err});
});

// Escucho el puerto para levantar el servidor
app.listen(parseInt(process.env.APP_PORT), () => {
    console.log("Esta corriendo el servidor!!!")
    console.log(result.parsed);
    console.log(sqlconfig);
});


// Creo funcion get para que el usuario obtnga la informacion que solicita.
app.get('/app/view/student/class', (req, res, next) =>{
    // Obtendre del querystring el parametro de busqueda del usuario.
    var clase = req.query.clase || 'informatica';

    // Realizare la consulta a la base de datos.
    sql.connect(sqlconfig).then(() => {
        return sql.query(`select * from dbo.estudiantes INNER JOIN matricula ON  e.idEstudiante =  m.idEstudiante INNER JOIN clases ON c.IdClase m.IdClase where nombreClase = ${clase}`);
    }).then(result => {
        var data = {
            seccess: true,
            message: '',
            data: result.recordset,
        }
        res.send(data);
        // cerrare la conexion.
        sql.close();
    }).catch(err => {
        return next(err);
    });



    console.log('Esta es una prueba')
    res.send("Funciono esto");
});
