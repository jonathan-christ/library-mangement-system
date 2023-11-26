module.exports = (app) => {
    const classification = require('../controllers/classification.controller.js')
    let router = require('express').Router()

    router.post("/create", classification.create)
    router.put("/update", classification.update)
    router.post("/delete", classification.delete)

    router.get("/", classification.findAll)
    router.post("/find", classification.findOne)

    app.use('/api/class', router)
}