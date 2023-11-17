module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("book", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        isbn: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
        },
        publisherID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "publisher",
                key: "id"
            }
        },
        publishDate: {
            type: Sequelize.DATE,
        }
    })

    return Book
}