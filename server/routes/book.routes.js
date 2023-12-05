module.exports = (app) => {
    const book = require('../controllers/book.controller.js')
    let router = require('express').Router()

    router.get("/", book.findAll)
    router.get("/hascopies", book.findAllHasCopies)
    router.post("/find", book.findOne)
    router.post("/create", book.create)
    router.post("/delete", book.delete)

    router.get("/count", book.count)

    app.use('/api/books', router)
}