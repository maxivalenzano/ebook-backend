const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: 'https://localhost:8081'
};

app.use(cors(corsOptions));

// habilitamos el bodyParser para leer datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//crear la conexión a la BD
const db = require('./app/models');
const Rol = db.rol;

db.sequelize.authenticate()
    .then(() => console.log('Conectando al servidor'))
    .catch(error => console.log(error));

db.sequelize.sync({force: true}).then(() =>{
    console.log('Drop and Resync DB');
    initial();
});

//ruta simple
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la Tienda de Libros' });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

//seteo de puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}.`);
});


//temprales, para ir probando
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
};

