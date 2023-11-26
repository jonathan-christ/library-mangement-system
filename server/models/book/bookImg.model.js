module.exports = (sequelize, Sequelize) => {
    // id, bookid, imglink, uploader/user
    const BookImage = sequelize.define("bookImg", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
            type: Sequelize.STRING(255),
            allowNull: false
        },
    })

    return BookImage
}