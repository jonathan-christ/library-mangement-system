module.exports = (app) => {
    const author = require('../controllers/author.controller.js')
    let router = require('express').Router()

    router.post("/create", author.create)

    router.get("/", author.findAll)
    router.post("/find", author.findOne)

    app.use('/api/authors', router)
}