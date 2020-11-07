const config = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle,
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/user.model.js')(sequelize, Sequelize);
db.rol = require('../models/rol.model.js')(sequelize, Sequelize);

db.rol.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "rolId",
    otherKey: "userId"
});
db.user.belongsToMany(db.rol, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "rolId"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
