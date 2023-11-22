module.exports = (sequelize, Sequelize) => {
    // id, user, book, value
    const Rating = sequelize.define("rating", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        },
        bookID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "book",
                key: "id"
            }
        },
        rating: {
            type: Sequelize.ENUM('like', 'dislike'),
            allowNull: false,
        }
    })

    return Rating

}