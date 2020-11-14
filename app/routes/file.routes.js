const controller = require("../controllers/file.controller");
const router = require("express").Router();

module.exports = app => {
  router.post("/api/upload", controller.upload);
  //router.get("/api/files", controller.getListFiles);
  router.get("/api/files/:name", controller.download);

  app.use(router);
};

