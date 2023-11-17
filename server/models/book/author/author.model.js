module.exports = (sequelize, Sequelize) => {
    // id, fname, lname, bio
    const Author = sequelize.define("author", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        firstName: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        bio: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    })

    return Author
}