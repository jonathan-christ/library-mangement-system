module.exports = (app) => {
    const book = require('../controllers/book.controller.js')
    let router = require('express').Router()

    router.post("/create", book.create)

    router.get("/find", book.findAll)
    router.post("/find/indiv", book.findOne)

    app.use('/api/books', router)
}