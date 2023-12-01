module.exports = (sequelize, Sequelize) => {
    // id, name, desc
    const Fine = sequelize.define("fine", {
        ticketID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "ticket",
                key: "id"
            }
        },
        categID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "fineCategory",
                key: "id"
            }
        },
        status: {
            type: Sequelize.ENUM('paid', 'unpaid'),
            allowNull: false,
            defaultValue: 'unpaid'
        },
        payDate: {
            type: Sequelize.DATE,
            allowNull: true,
        }
    })

    return Fine
}