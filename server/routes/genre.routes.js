module.exports = (app) => {
    const genre = require('../controllers/genre.controller.js')
    let router = require('express').Router()

    router.post("/create", genre.create)

    router.get("/find", genre.findAll)
    router.post("/find/indiv", genre.findOne)

    app.use('/api/genres', router)
}