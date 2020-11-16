const ebooks = require("../controllers/ebook.controller.js");
const router = require("express").Router();

module.exports = app => {
    // Crea un libro nuevo
    router.post("/api/ebooks/", ebooks.create);
  
    // Recuperar todos los libros
    router.get("/api/ebooks/", ebooks.findAll);
  
    // Recuperar todos los libros publicados
    router.get("/api/ebooks/published", ebooks.findAllPublished);
  
    // Recuperar un solo libro con id
    router.get("/api/ebooks/:id", ebooks.findOne);
  
    // Actualizar un libro con id
    router.put("/api/ebooks/:id", ebooks.update);
  
    // Eliminar un libro con id
    router.delete("/api/ebooks/:id", ebooks.delete);
  
    // Eliminar todos los libros
    router.delete("/api/ebooks/", ebooks.deleteAll);
  
    app.use(router);
  };