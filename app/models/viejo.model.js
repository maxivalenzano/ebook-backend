module.exports = (sequelize, Sequelize) => {
    const Ebook = sequelize.define("ebooks", {
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Ebook;
  };