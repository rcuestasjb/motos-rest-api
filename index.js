const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Base de datos 
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'xxxx',
    host: 'xxxx',
    database: 'xxxx',
    password: 'xxxx',
    port: 5432,
});

const getTest = (request, response) => {
    response.send('Hola test')
}
app.get('/test', getTest);

const getMotosFiltered = (request, response) => {
    var marca = request.param('marca');
    if( marca ){
        var consulta = "SELECT * FROM motos WHERE LOWER(marca) =LOWER('"+marca+"') ORDER BY modelo ASC ";
    }else{
        var consulta = "SELECT * FROM motos  ORDER BY modelo ASC ";
    }
    pool.query(consulta, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
app.get('/motos', getMotosFiltered);

const addMoto = (request, response) => {
    const { marca, modelo, year, foto, precio } = request.body
    console.log(marca, modelo, year, foto, precio);
    pool.query('INSERT INTO motos (marca,modelo,year,foto,precio) VALUES ($1,$2,$3,$4,$5)', [marca, modelo, year, foto, precio], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Una nueva moto a sido añadida: ${results}`)
    })
}
app.post('/moto', addMoto);

const deleteMoto = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM motos WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}
app.delete('/moto/:id', cors(), deleteMoto);

var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        fs.mkdir(FOTO_PATH, function (err) {
            if (err) {
                callback(null, FOTO_PATH);
            } else {
                callback(null, FOTO_PATH);
            }
        })
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+"_"+file.originalname );
    }
});

app.post('/moto/foto/:id', function (req, res) {
    const id = (req.params.id);
    
    if( isNaN(id) ){
        res.status(500).send("El id no es válido");
        return;
    }

    pool.query("SELECT * FROM motos WHERE id="+id)
    .then(results => {
        if( results.rows.length == 1 ){
            var upload = multer({ storage: storage }).single('foto');

            console.log(upload);
            upload(req, res, function (err) {
                
                
                console.log(req.body.modelo);
                
                
                if (err) {
                    return res.end("Error uploading file.");
                }
                res.end("Fichero enviado");
            });
        }
        else{
            res.status(500).send("El id de la moto NO existe");
        }
    })
    .catch(err => {
        res.status(500).send("El id de la moto existe");
    });
});

const PORT = process.env.ALWAYSDATA_HTTPD_PORT || 3000;
const IP = process.env.ALWAYSDATA_HTTPD_IP || null;

if( PORT != 3000 ){
    FOTO_PATH = '/home/empleomap/m7/moto_rest/fotos';
}
else{
    FOTO_PATH = 'C:\\Users\\rafa\\Desktop\\ionic\\motos-rest-api\\fotos';
}
app.listen(PORT, IP, () => {
    console.log("El servidor está inicializado en el puerto "+PORT );
});
  