module.exports = (sequelize, Sequelize) => {
    // id, bookdetails (bookid), dateAdded, condition, availability (last 2 enums)
    const BookCopy = sequelize.define("bookCopy", {
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
        dateAdded: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM('good', 'damaged', 'lost'),
            allowNull: false
        },
        available: {
            type: Sequelize.ENUM('yes', 'no'),
            allowNull: false
        }
    })

    return BookCopy
}