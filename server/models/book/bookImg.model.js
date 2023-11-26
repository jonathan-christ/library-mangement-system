module.exports = (sequelize, Sequelize) => {
    // id, bookid, imglink, uploader/user
    const BookImage = sequelize.define("bookImg", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING(100),
            allowNull: false,
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