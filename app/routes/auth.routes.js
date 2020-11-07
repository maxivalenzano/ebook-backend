const { verifySignUp } = require('../middleware/verifySignUp');
const controller = require('../controllers/auth.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.headers(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/signup",
        [
          verifySignUp.checkDuplicate,
          verifySignUp.checkRolesExisted
        ],
        controller.signup
        );

        app.post("/api/auth/signin", controller.signin);
};