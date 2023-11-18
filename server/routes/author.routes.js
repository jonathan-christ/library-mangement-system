module.exports = (app) => {
    const author = require('../controllers/author.controller.js')
    let router = require('express').Router()

    router.post("/create", author.create)

    router.get("/find", author.findAll)
    router.post("/find/indiv", author.findOne)

    app.use('/api/authors', router)
}