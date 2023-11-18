module.exports = (app) => {
    const library = require('../controllers/library.controller.js')
    let router = require('express').Router()

    router.post("/books/add", library.addBook)
    router.post("/books/", library.findAllBooks)
    router.post("/books/:isbn", library.findBook)

    app.use('/api/library', router)
}