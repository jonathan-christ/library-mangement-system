module.exports = (app) => {
    const publisher = require('../controllers/publisher.controller.js')
    let router = require('express').Router()

    router.post("/create", publisher.create)
    router.put("/update", publisher.update)
    router.post("/delete", publisher.delete)

    router.get("/", publisher.findAll)
    router.post("/find", publisher.findOne)

    app.use('/api/publishers', router)
}