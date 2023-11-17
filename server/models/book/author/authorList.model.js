module.exports = (sequelize, Sequelize) => {
    // id, fname, lname, bio
    const AuthorList = sequelize.define("authorList", {
        bookID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "book",
                key: "id"
            }
        },
        authorID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "author",
                key: "id"
            }
        },
    })

    return AuthorList
}