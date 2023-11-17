module.exports = (sequelize, Sequelize) => {
    // id, bookid, imglink, uploader/user
    const BookImage = sequelize.define("bookImg", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        bookID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "book",
                key: "id"
            }
        },
        uploaderID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        },
        imgLink: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
    })

    return BookImage
}