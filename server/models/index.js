const dbConfig = require("../configs/db.config.js")

const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  define: {
    timestamps: false
  }
})

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize
}

// connect to all models
db.user = require("./user.model.js")(sequelize, Sequelize)
db.userType = require("./userType.model")(sequelize, Sequelize)

//relations
db.user.hasMany(db.userType)


module.exports = db