const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

//chqueamos si los usernames o email ya exiten
checkDuplicate = (req, res, next) => {
    //  usernames
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: 'Disculpe, ese usuario ya se encuentra en uso'
            });
            return
        }
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: 'Disculpe, ese Email ya se encuentra en uso'
                });
                return;
            }
            next();
        });
    });    
};

//Chequeamos que los reloes exitan
checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Disculpe, el rol ${req.body.roles[i]} no existe`
                });
                return;
            }
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicate: checkDuplicate,
    checkRolesExited: checkRolesExisted
};

module.exports = verifySignUp;