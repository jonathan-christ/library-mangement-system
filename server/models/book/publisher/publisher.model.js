module.exports = (sequelize, Sequelize) => {
    // id, name, address
    const Publisher = sequelize.define("publisher", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        address: {
            type: Sequelize.TEXT
        }
    })

    return Publisher
}