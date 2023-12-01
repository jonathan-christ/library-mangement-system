module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("book", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        isbn: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
        },
        baseCallNumber: {
            type: Sequelize.STRING(30),
            alowNull: false
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
        },
        pages: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        imageID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            references: {
                model: "bookImg",
                key: "id"
            }
        },
        classificationID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references : {
                model: "classification",
                key: "id"
            }
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
            defaultValue: Sequelize.NOW
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    })

    return Book
}