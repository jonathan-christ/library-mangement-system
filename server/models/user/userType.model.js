module.exports = (sequelize, Sequelize) => {
  const UserType = sequelize.define("userType", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT('medium')
    }
  })

  return UserType
}