module.exports = (sequelize, Sequelize) => {
    // id, name, desc
    const Ticket = sequelize.define("ticket", {
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
        copyID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "book",
                key: "id"
            }
        },
        createDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        lendDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        closeDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM("queued", "borrowed", "closed", "overdue")
        }
    })

    return Ticket
}