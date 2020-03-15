const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Base de datos 
require('./bbdd.js');
const Pool = require('pg').Pool
const pool = new Pool(ddbbConfig);

const getTest = (request, response) => {
    response.send('Hola test')
}
app.get('/test', getTest);

const getMotosFiltered = (request, response) => {
    var marca = request.param('marca');
    if (marca) {
        var consulta = "SELECT * FROM motos WHERE LOWER(marca) =LOWER('" + marca + "') ORDER BY modelo ASC ";
    } else {
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
    });
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
var fileName;
var guardarImg = multer.diskStorage({
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
        fileName = Date.now() + "_" + file.originalname;
        callback(null, Date.now() + "_" + file.originalname);
    }
});

app.post('/moto/foto', cors(), function (req, res) {
    var upload = multer({ storage: guardarImg }).single('foto');

    upload(req, res, function (err) {
        let { marca, modelo, year, foto, precio } = req.body;
        foto = FOTO_URL+"/"+fileName;
        pool.query('INSERT INTO motos (marca,modelo,year,foto,precio) VALUES ($1,$2,$3,$4,$5)', [marca, modelo, year, foto, precio], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Una nueva moto a sido añadida `)
        });
        if (err) {
            return res.end("Error uploading file.");
        }
    });
});
app.delete('/moto/:id', cors(), deleteMoto);
const fillMotos = (request, response) => {
    pool.query(`
        INSERT INTO motos (marca,modelo,year,foto,precio) VALUES 
        ('Ducati', 'Ducati 950 Hypermotard','2017','https://www.cuidamostumoto.com/sites/default/files/ducati-hypermotard-950-2019.jpg','16.890€'),
        ('Ducati', 'Monster 797 Plus','2019','https://www.cuidamostumoto.com/sites/default/files/ducati_monster-797_2019.jpg','9.090€'),
        ('Ducati', 'Scrambler 1100','2018','http://motos-b60.kxcdn.com/sites/default/files/ducati-scrambler-1100.jpg','13.190€'),
        ('Ducati', 'Panigale V4','2018','http://motos-b60.kxcdn.com/sites/default/files/ducati-panigale-v4-2018-2.jpg','17.890€'),
        ('Ducati', 'Multistrada 1260','2018','http://motos-b60.kxcdn.com/sites/default/files/ducati-multistrada-1260-2018.jpg','17.890€'),
        ('Ducati', 'Scrambler Icon','2020','http://motos-b60.kxcdn.com/sites/default/files/ducati-scrambler-icon.jpg','8.790€'),
        ('Ducati', 'Scrambler Classic ','2020','http://motos-b60.kxcdn.com/sites/default/files/ducati_scrambler_classic_2016.jpg','10.350€'),
        ('Ducati', 'Panigale V4 25 Aniversario 916','2020','http://motos-b60.kxcdn.com/sites/default/files/ducati-panigale-v4-25-aniversario-916.jpg','48.000€'),
        ('Ducati', 'Panigale V4 S','2014','http://motos-b60.kxcdn.com/sites/default/files/ducati-panigale-v4-s-2020.jpg','31.590€'),
        ('Ducati', 'MONSTER 1200 ','2012','https://a.mcdn.es/mnet_ft//DUCATI/MONSTER_1200/30135MG.jpg/660x/','13.650 €'),
        ('Ducati', 'MONSTER 1200','2020','https://a.mcdn.es/mnet_ft//DUCATI/MONSTER_1200/6164/30075MG.jpg/660x/','18.090€'),
        ('Ducati', 'Monster 1200 S Black on Black','2019','http://motos-b60.kxcdn.com/sites/default/files/ducati-monster-1200-s-black-on-black-4.jpg','20.090 €'),
        ('Ducati', 'Scrambler Café Racer','2019','http://motos-b60.kxcdn.com/sites/default/files/ducati-scrambler-cafe-racer-2019.jpg','11.690€'),
        ('Ducati', 'Scrambler Desert Sled','2019','http://motos-b60.kxcdn.com/sites/default/files/ducati-scrambler-desert-sled-2019-2.jpg','11.790€'),
        ('Ducati', 'Multistrada 1260','2019','http://motos-b60.kxcdn.com/sites/default/files/ducati-multistrada-1260-2018.jpg','17.890€'),
        ('Ducati', 'Hypermotard ','2018','https://a.mcdn.es/mnet_ft//DUCATI/HYPERMOTARD/6736/34138MG.jpg/660x','13.690 €'),
        ('Ducati', '950 Hypermotard 2019','2019','https://a.mcdn.es/mnet_ft//DUCATI/HYPERMOTARD/6736/34138MG.jpg/660x/','16.890 €'),
        ('Ducati', 'Diavel','2014','http://motos-b60.kxcdn.com/sites/default/files/ducati-diavel-1260-2019.jpg','16.890 €'),
        ('Ducati', '1260 Diavel S','2021','http://motos-b60.kxcdn.com/sites/default/files/ducati-diavel-1260-s-2019.jpg','23.590 €'),
        ('Ducati', 'Scrambler Icon 2019','2019','http://motos-b60.kxcdn.com/sites/default/files/ducati-scrambler-icon-2019.jpg','9.190€'),
        ('Yamaha','X-Max 125 ABS','2019','https://api.motorpress-iberica.es/motociclismo-fichas/api/v1/images/modelo/59d1fa56048e5cf776ad181e.jpg','4.749 €'),
        ('Yamaha','NMax 125','2019','https://api.motorpress-iberica.es/motociclismo-fichas/api/v1/images/modelo/5559b080cb00987779a78eaa.jpg','3.099 €'),
        ('Yamaha','X-Max 400','2019','https://api.motorpress-iberica.es/motociclismo-fichas/api/v1/images/modelo/5559b080cb00987779a78eaa.jpg','6.699 €'),
        ('Yamaha','MT-125','2019','https://api.motorpress-iberica.es/motociclismo-fichas/api/v1/images/modelo/54e5a5c885bd0aca0e0021e7.jpg','4.849 €'),
        ('Yamaha','YZF 125 R ABS','2019','https://api.motorpress-iberica.es/motociclismo-fichas/api/v1/images/modelo/5874a873707ba4a76fa53c95.jpg','5.249 €'),
        ('Yamaha','X-MAX 300','2018','https://api.motorpress-iberica.es/motociclismo-fichas/api/v1/images/modelo/5806306bb95209241c81696f.jpg','5.799 €'),
        ('Yamaha','XP 530 T-Max ABS','2016','https://api.motorpress-iberica.es/motociclismo-fichas/api/v1/images/modelo/5874a7d0707ba4a76fa53c93.jpg','12.299 €'),
        ('Honda','CB125R','2018','https://www.motofichas.com/images/phocagallery/Honda/cb125r-2018/01-honda-cb125r-2018-estatica.jpg','4.275 €'),
        ('Honda','CB500X','2019','https://www.motofichas.com/images/phocagallery/Honda/cb500x-2019/01-honda-cb500x-2019-perfil-blanco.jpg','6.750€'),
        ('Honda','FORZA 125','2018','https://www.motofichas.com/images/phocagallery/Honda/forza-125-2018/01-honda-forza-125-2018-rojo-estatica.jpg','5.050 €'),
        ('Honda','X-ADV','2020','https://www.motofichas.com/images/phocagallery/Honda/x-adv-2019/01-honda-x-adv-2019-verde-militar.jpg','11.800 €'),
        ('Honda','CBR500R','2019','https://www.motofichas.com/images/cache/01-honda-cbr500r-2019-perfil-rojo-739-a.jpg','6.800 €'),
        ('Honda','CB500F','2019','https://www.motofichas.com/images/phocagallery/Honda/cb500f-2019/01-honda-cb500f-2019-perfil-blanca.jpg','6.250 €'),
        ('Honda','MSX 125','2017','https://cdn.totmoto.com/tienda/motos-y-scooters/motos-de-50cc.-a-125cc./motos-honda/honda-msx-125/image_1_preview','4.300');
    `, (error, results) => {
        if (error) {
            console.log("Error faltal");
        }
        response.status(201).send('Un monton de motos han sido añadidas');
    });

}
app.get('/fillMotos', fillMotos);


const PORT = process.env.ALWAYSDATA_HTTPD_PORT || 3000;
const IP = process.env.ALWAYSDATA_HTTPD_IP || null;

if (PORT != 3000) {
    FOTO_PATH = '/home/empleomap/m7/moto_rest/fotos';
    FOTO_URL = 'http://motos.puigverd.org/imgs/';
}
else {
    FOTO_PATH = 'C:\\Users\\rafa\\Desktop\\ionic\\motos-rest-api\\fotos';
    FOTO_URL = "http://localhost:3000/imgs";
}

app.use('/imgs', express.static('fotos'));     //esto es para servir los archos estaticos 

app.listen(PORT, IP, () => {
    console.log("El servidor está inicializado en el puerto " + PORT);
});
