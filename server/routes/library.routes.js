module.exports = (app) => {
    const library = require('../controllers/library.controller.js')
    let router = require('express').Router()

    router.post("/books/add", library.addBook)

    app.use('/api/library', router)
}