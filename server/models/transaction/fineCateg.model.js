module.exports = (sequelize, Sequelize) => {
    // id, name, desc
    const FineCategory = sequelize.define("fineCategory", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        amount: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        }
    })

    return FineCategory
}