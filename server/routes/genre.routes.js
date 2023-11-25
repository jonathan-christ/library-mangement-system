module.exports = (app) => {
    const genre = require('../controllers/genre.controller.js')
    let router = require('express').Router()

    router.post("/create", genre.create)
    router.put("/update", genre.update)
    router.post("/delete", genre.delete)

    router.get("/", genre.findAll)
    router.post("/find", genre.findOne)

    app.use('/api/genres', router)
}