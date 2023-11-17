module.exports = (sequelize, Sequelize) => {
    // id, name, desc
    const Genre = sequelize.define("genre", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        }
    })

    return Genre
}