const controller = require("../controllers/image.controller");
const router = require("express").Router();

module.exports = app => {
  router.post("/api/uploadI", controller.upload);
  router.get("/api/images/:name", controller.download);

  app.use(router);
};

