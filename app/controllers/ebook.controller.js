const db = require("../models");
const Ebook = db.ebook;
const Op = db.Sequelize.Op;

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

// Crear y guardar un nuevo libro
exports.create = (req, res) => {
  // Validando la request
  if (!req.body.title) {
    res.status(400).send({
      message: "El contenido no puede estar vacío"
    });
    return;
  }

  const ebook = {
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    editorial: req.body.editorial,
    description: req.body.description,
    price: req.body.price,
    published: req.body.published ? req.body.published : false,
    url: req.body.url,
    image: req.body.image
  };

  // Guardando libro en la DB
  Ebook.create(ebook)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Se produjo un error al crear el libro"
      });
    });
};

// Recuperar todos los libros de la base de datos
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    const { limit, offset } = getPagination(page, size);
  
    Ebook.findAndCountAll({ where: condition, limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Se produjo un error al recuperar libros"
        });
      });
  };

// buscar libro por ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Ebook.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al recuperar el libro con el ID=" + id
      });
    });
};

// Actualizar un libro por id
exports.update = (req, res) => {
  const id = req.params.id;

  Ebook.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "El libro se actualizó correctamente"
        });
      } else {
        res.send({
          message: `No se puede actualizar el libro con id=${id}. Tal vez no se encontró el libro o el req.body está vacio`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al actualizar el libro con id =" + id
      });
    });
};

// Eliminar un libro con la ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Ebook.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "el libro se eliminó correctamente"
        });
      } else {
        res.send({
          message: `no se pudo eliminar el libro con el=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo borrar el libro con el id =" + id
      });
    });
};

// Eliminar todos los libros de la base de datos
exports.deleteAll = (req, res) => {
  Ebook.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Todos los libros se eliminaron correctamente` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Se produjo un error al eliminar todos los libros"
      });
    });
};

// encontrar todos los libros publicados
exports.findAllPublished = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Ebook.findAndCountAll({ where: { published: true }, limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Se produjo un error al encontrar los libros"
        });
      });
  };

  //buscar todos los usuarios de un determinado libro
  exports.findById = (id) => {
    return Ebook.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username", "email"],
          through: {
            attributes: [],
          },
        },
      ],
    })
      .then((ebook) => {
        return ebook;
      })
      .catch((err) => {
        console.log("Error al encontrar el libro: ", err);
      });
  };