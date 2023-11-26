module.exports = (sequelize, Sequelize) => {
  // id, name, desc
  const Classification = sequelize.define("classification", {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      name: {
          type: Sequelize.STRING(30),
          allowNull: false
      },
      description: {
          type: Sequelize.TEXT
      }
  })

  return Classification
}