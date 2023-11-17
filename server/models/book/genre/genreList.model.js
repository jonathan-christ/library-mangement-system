module.exports = (sequelize, Sequelize) => {
    // id, fname, lname, bio
    const GenreList = sequelize.define("genreList", {
        bookID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "book",
                key: "id"
            }
        },
        genreID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "genre",
                key: "id"
            }
        },
    })

    return GenreList
}