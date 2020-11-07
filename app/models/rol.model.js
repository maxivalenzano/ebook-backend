module.exports = (sequelize, Sequelize) => {
    const Rol = sequelize.define('roles', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:  true
        },
        name: {
            type: Sequelize.STRING
        }
    });
    
    return Rol;
};