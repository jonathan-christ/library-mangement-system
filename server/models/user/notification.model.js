module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define('notification', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
              }
        },
        ticketID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "ticket",
                key: "id"
              }
        },
        text: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        sendDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        isRead: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    })

    return Notification
}