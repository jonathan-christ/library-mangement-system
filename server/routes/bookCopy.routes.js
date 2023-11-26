module.exports = (app) => {
    const bookCopy = require('../controllers/bookCopy.controller.js')
    let router = require('express').Router()

    router.post("/create", bookCopy.create)
    router.put("/update", bookCopy.update)
    router.post("/delete", bookCopy.delete)

    router.get("/", bookCopy.findAll)
    router.post("/find", bookCopy.findOneID)

    app.use('/api/copies', router)
}