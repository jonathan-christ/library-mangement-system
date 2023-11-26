module.exports = (sequelize, Sequelize) => {
    // id, bookdetails (bookid), dateAdded, condition, availability (last 2 enums)
    const BookCopy = sequelize.define("bookCopy", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        callNumber: {
            type: Sequelize.STRING(35),
            alowNull: false
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
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_DATE')
        },
        status: {
            type: Sequelize.ENUM('good', 'damaged', 'lost'),
            allowNull: false,
            defaultValue: 'good'
        },
        available: {
            type: Sequelize.ENUM('yes', 'no'),
            allowNull: false,
            defaultValue: 'yes'
        }
    })

    return BookCopy
}