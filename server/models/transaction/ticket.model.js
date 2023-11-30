module.exports = (sequelize, Sequelize) => {
    // id, name, desc
    const Ticket = sequelize.define("ticket", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        uuid: {
            type: Sequelize.STRING(36),
            allowNull: false
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
        copyID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: "bookCopy",
                key: "id"
            }
        },
        createDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        reserveDate: {
            type: Sequelize.DATE,
            defaultValue: null,
        },
        lendDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
        },
        returnDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
        },
        status: {
            type: Sequelize.ENUM("queued", "reserved", "borrowed", "closed", "overdue", "cancelled"),
            defaultValue: "queued"
        }
    })

    return Ticket
}