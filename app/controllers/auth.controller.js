const db = require('../models/');
const config = require('../config/auth.config');
const User = db.user;
const Rol = db.rol;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { user } = require('../models/');

exports.signup = (req, res) => {
    //guardamos los usuarios en la base de datos
    user.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    .then(user =>{
        if (req.body.roles) {
            Rol.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles => {
                user.setRoles(roles).then(() => {
                    res.send({ 
                        message: "El usuario se ha registrado correctamente"
                    });
                });
            });
        } else {
            user.setRoles([1]).then(() => {
                res.send({
                    message: "El usuario se ha registrado correctamente"
                });
            });
        };
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (!user) {
            return res.status(404).send({
                message: 'Usuario no encontrado'
            });
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Contraseña incorrecta'
            });
        }

        var token = jwt.sign({ id: user.id}, config.secret, {
            expiresIn: 7200 // 2 horas
        });

        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push(`ROL_${roles[i].name.toUpperCase()}`);
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};