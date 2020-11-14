module.exports = (sequelize, Sequelize) => {
  const Ebook = sequelize.define("ebooks", {
    title: {
      type: Sequelize.STRING
    },
    author: {
      type: Sequelize.STRING
    },
    year: {
      type: Sequelize.INTEGER
    },
    editorial: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.DOUBLE
    },
    published: {
      type: Sequelize.BOOLEAN
    },
    url: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    }
  });

  return Ebook;
};