const ebooks = require("../controllers/ebook.controller.js");
const router = require("express").Router();

module.exports = app => {
    // Create a new Ebook
    router.post("/api/ebooks/", ebooks.create);
  
    // Retrieve all Ebooks
    router.get("/api/ebooks/", ebooks.findAll);
  
    // Retrieve all published Ebooks
    router.get("/api/ebooks/published", ebooks.findAllPublished);
  
    // Retrieve a single Ebook with id
    router.get("/api/ebooks/:id", ebooks.findOne);
  
    // Update a Ebook with id
    router.put("/api/ebooks/:id", ebooks.update);
  
    // Delete a Ebook with id
    router.delete("/api/ebooks/:id", ebooks.delete);
  
    // Delete all Ebooks
    router.delete("/api/ebooks/", ebooks.deleteAll);
  
    app.use(router);
  };