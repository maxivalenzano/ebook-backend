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
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, tutorials, totalPages, currentPage };
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
  User.findByPk(id, {
    include: [
      {
        model: Ebook,
        as: "ebooks",
        attributes: ["id", "title", "description"],
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
      console.log(">> Error while finding User: ", err);
    });
};

exports.addEbook = (userId, ebookId) => {
  return User.findByPk(userId)
    .then((user) => {
      if (!user) {
        console.log("User not found!");
        return null;
      }
      return Ebook.findByPk(ebookId).then((ebook) => {
        if (!ebook) {
          console.log("Ebook not found!");
          return null;
        }

        user.addEbook(ebook);
        console.log(`>> added Ebook id=${ebook.id} to User id=${user.id}`);
        return user;
      });
    })
    .catch((err) => {
      console.log(">> Error while adding Ebook to User: ", err);
    });
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
