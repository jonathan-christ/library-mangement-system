module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    typeID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "userType",
        key: "id"
      }
    },
    firstName: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    middleName: {
      type: Sequelize.STRING(30),
      isAlpha: true,
    },
    lastName: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    suffix: {
      type: Sequelize.STRING(10)
    },
    sex: {
      type: Sequelize.ENUM('male', 'female'),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(50),
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.BLOB,
      allowNull: false
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  return User
}