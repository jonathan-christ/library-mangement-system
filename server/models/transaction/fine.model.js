module.exports = (sequelize, Sequelize) => {
    // id, name, desc
    const Fine = sequelize.define("fine", {
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "user",
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
        }
    })

    return Fine
}