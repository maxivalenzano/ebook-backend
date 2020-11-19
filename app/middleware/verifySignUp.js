const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Verificamos que no haya email duplicado
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Disculpe, ese correo ya se encuentra en uso "
      });
      return;
    }
    //pasó tranqui
    next();
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Disculpe, el Rol: ${req.body.roles[i]} no existe`
        });
        return;
      }
    }
  }

  next();
};
checkUsernameOrEmail = (req, res, next) => {
  // verificamos que exista el nombre de usuario
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (!user) {
      res.status(400).send({
        message: "Nombre de usuario o email no identificado"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (!user) {
        res.status(400).send({
          message: "Nombre de usuario o email no identificado"
        });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkRolesExisted: checkRolesExisted,
  checkUsernameOrEmail: checkUsernameOrEmail,
};

module.exports = verifySignUp;
