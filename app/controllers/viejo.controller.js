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

// Create and Save a new Ebook
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Ebook
  const ebook = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save Ebook in the database
  Ebook.create(ebook)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Ebook."
      });
    });
};

// Retrieve all Ebooks from the database.
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
            err.message || "Some error occurred while retrieving ebooks."
        });
      });
  };

// Find a single Ebook with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Ebook.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Ebook with id=" + id
      });
    });
};

// Update a Ebook by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Ebook.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Ebook was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Ebook with id=${id}. Maybe Ebook was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Ebook with id=" + id
      });
    });
};

// Delete a Ebook with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Ebook.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Ebook was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Ebook with id=${id}. Maybe Ebook was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Ebook with id=" + id
      });
    });
};

// Delete all Ebooks from the database.
exports.deleteAll = (req, res) => {
  Ebook.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Ebooks were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all ebooks."
      });
    });
};

// find all published Ebook
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
            err.message || "Some error occurred while retrieving ebooks."
        });
      });
  };

  exports.findById = (id) => {
    return Ebook.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username"],
          through: {
            attributes: [],
          },
          // through: {
          //   attributes: ["tag_id", "ebook_id"],
          // },
        },
      ],
    })
      .then((ebook) => {
        return ebook;
      })
      .catch((err) => {
        console.log(">> Error while finding Ebook: ", err);
      });
  };