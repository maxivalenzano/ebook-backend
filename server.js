const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: 'https://localhost:8081'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
//Parsea las request a un tipo json
app.use(bodyParser.json());

//parsea las request a un tipo x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//rutas simples
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la Tienda de Libros' });
});

//seteo de puerto, escuchamos las requests entrantes 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}.`);
});

const db = require('./app/models');
const Rol = db.rol;

db.sequelize.sync({force: true}).then(() =>{
    console.log('Drop and Resync DB');
    initial();
});

function initial() {
    Rol.create({
        id: 1,
        name: "user"
    });
    Rol.create({
        id: 2,
        name: "moderator"
    });
    Rol.create({
        id: 3,
        name: "admin"
    });
}