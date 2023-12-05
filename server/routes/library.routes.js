module.exports = (app) => {
    const library = require('../controllers/library.controller.js')
    let router = require('express').Router()

    router.get("/books", library.findAllBooks)
    router.post("/books/search", library.searchBooks)
    router.post("/books/find", library.findBook)
    router.post("/books/add", library.addBook)
    router.post("/books/update", library.updateBook)

    router.get("/graphs/popular-subject-users", library.subjectGraph)
    router.get("/graphs/monthly-ticket-issues", library.monthlyTickets)

    app.use('/api/library', router)
}