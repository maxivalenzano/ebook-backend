const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Guardar usuario en la base de datos
  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "Usuario registrado correctamente" });
          });
        });
      } else {
        // si solo tiene rol de usuario
        user.setRoles([1]).then(() => {
          res.send({ message: "Usuario registrado correctamente" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//inicio de sesion
exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Contraseña Incorrecta"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 3600 // 60 minutos
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.recovery = (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 8);
  const email = req.body.email;

  User.update(
    { password: password },
    { where: { email: email } })
    .then(user => {
      if (user == 1) {
        res.send({
          message: "La contraseña se actualizó correctamente"
        });
      } else {
        res.send({
          message: `No se pudo actualizar el usuario con el email: ${email}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error al actualizar el usuario con el email: ${email}`
      });
    });
}