const db = require("../models");

const User = db.user;
const Ebook = db.ebook;

//establecemos los valores predeterminados de la paginacion
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: ebooks } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, ebooks, totalPages, currentPage };
};

exports.findAll = () => {
  return User.findAll({
    include: [
      {
        model: Ebook,
        as: "ebooks",
        attributes: ["id", "title", "description", "published"],
        through: {
          attributes: [],
        }
      },
    ],
  })
    .then((user) => {
      return user;
    })
    .catch((err) => {
      console.log(">> Error mientras se buscaba los Titulos del Usuario: ", err);
    });
};

exports.findById = (req, res) => {
  const id = req.userId;
  //console.log(req);
  User.findByPk(id, {
    include: [
      {
        model: Ebook,
        as: "ebooks",
        attributes: ["id", "title", "description", "author", "year", "editorial" , "price", "url", "image", "published"],
        through: {
          attributes: [],
        }
      },
    ],
  })
    .then((user) => {
      //console.log(JSON.stringify(user, null, 2));
      res.status(200).send(JSON.stringify(user, null, 2));
      //return user;
    })
    .catch((err) => {
      console.log(">> Error mientras se realizaba la busqueda: ", err);
    });
};

exports.addEbook = (req, res) => {
  console.log(req.body);
  const userid = req.body.data.userid;
  const ebookid = req.body.data.ebookid;
  return User.findByPk(userid)
    .then((user) => {
      if (!user) {
        console.log("Usuario no encontrado!");
        return null;
      }
      return Ebook.findByPk(ebookid).then((ebook) => {
        if (!ebook) {
          console.log("Libro no encontrado!");
          return null;
        }

        user.addEbook(ebook)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Se produjo un error al asociar el libro"
          });
        });
        console.log(`>> Se registró el Libro id=${ebook.id}, con el usuario id=${user.id}`);
        return user;
      });
    })
    .catch((err) => {
      console.log(">> Error durante el registro del usuario con el libro: ", err);
    });
};
exports.allAccess = (req, res) => {
  res.status(200).send("Contenido público");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Contenido del usuario");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Contenido de Administrador");
};

