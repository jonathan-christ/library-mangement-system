module.exports = (app) => {
    const bookCopy = require('../controllers/bookCopy.controller.js')
    let router = require('express').Router()

    router.post("/create", bookCopy.create)
    router.put("/update", bookCopy.update)
    router.post("/delete", bookCopy.delete)

    router.post("/", bookCopy.findAll)
    router.post("/find", bookCopy.findOne)

    app.use('/api/copies', router)
}