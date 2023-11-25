module.exports = (sequelize, Sequelize) => {
    // id, name, desc
    const Subject = sequelize.define("subject", {
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

    return Subject
}