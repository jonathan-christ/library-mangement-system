module.exports = (app) => {
    const rating = require('../controllers/rating.controller.js')
    let router = require('express').Router()

    router.post("/create", function (req, res) { rating.create })

    router.get("/find", function (req, res) { rating.findAll })
    router.post("/find/indiv", function (req, res) { rating.findOne })

    app.use('/api/ratings', router)
}