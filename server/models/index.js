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
  sequelize: sequelize,
  Sequelize: Sequelize
}

// connect to all models
db.user = require("./user/user.model.js")(sequelize, Sequelize)
db.userType = require("./user/userType.model")(sequelize, Sequelize)

db.book = require('./book/book.model')(sequelize, Sequelize)
db.bookCopy = require('./book/bookCopy.model')(sequelize, Sequelize)
db.bookImg = require('./book/bookImg.model')(sequelize, Sequelize)

db.author = require('./book/author/author.model')(sequelize, Sequelize)
db.authorList = require('./book/author/authorList.model')(sequelize, Sequelize)

db.genre = require('./book/genre/genre.model')(sequelize, Sequelize)
db.genreList = require('./book/genre/genreList.model')(sequelize, Sequelize)

db.subject = require('./book/subject/subject.model')(sequelize, Sequelize)
db.subjectList = require('./book/subject/subjectList.model')(sequelize, Sequelize)

db.classification = require('./book/classification/classification.model')(sequelize, Sequelize)
db.publisher = require('./book/publisher/publisher.model')(sequelize, Sequelize)
db.rating = require('./book/rating/rating.model')(sequelize, Sequelize)

//RELATIONS
// user
db.userType.hasMany(db.user, { foreignKey: 'typeID' })
db.user.hasMany(db.rating, { foreignKey: 'userID' })
db.rating.belongsTo(db.user, { foreignKey: 'userID' })

// books
db.book.belongsTo(db.bookImg, { foreignKey: 'imageID' })
db.bookImg.hasMany(db.book, { foreignKey: 'imageID' })

db.book.hasMany(db.bookCopy, { foreignKey: 'bookID' })
db.bookCopy.belongsTo(db.book, { foreignKey: 'bookID' })

db.book.hasMany(db.rating, { foreignKey: 'bookID' })
db.rating.belongsTo(db.book, { foreignKey: 'bookID' })

db.author.belongsToMany(db.book, { through: db.authorList, foreignKey: 'authorID' })
db.book.belongsToMany(db.author, { through: db.authorList, foreignKey: 'bookID' })

db.genre.belongsToMany(db.book, { through: db.genreList, foreignKey: 'genreID' })
db.book.belongsToMany(db.genre, { through: db.genreList, foreignKey: 'bookID' })

db.subject.belongsToMany(db.book, { through: db.subjectList, foreignKey: 'subjectID' })
db.book.belongsToMany(db.subject, { through: db.subjectList, foreignKey: 'bookID' })

db.book.belongsTo(db.publisher, { foreignKey: 'publisherID' })
db.publisher.hasMany(db.book, { foreignKey: 'publisherID' })

db.book.belongsTo(db.classification, { foreignKey: 'classificationID' })
db.classification.hasMany(db.book, { foreignKey: 'classificationID' })


module.exports = db