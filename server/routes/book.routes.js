module.exports = (app) => {
    const book = require('../controllers/book.controller.js')
    let router = require('express').Router()

    router.get("/", book.findAll)
    router.post("/find", book.findOne)
    router.post("/create", book.create)

    app.use('/api/books', router)
}