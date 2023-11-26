module.exports = (app) => {
    const bookImg = require('../controllers/bookImg.controller.js')
    let router = require('express').Router()

    router.post("/create", bookImg.create)
    router.put("/update", bookImg.update)
    router.post("/delete", bookImg.delete)

    router.get("/", bookImg.findAll)
    router.post("/find", bookImg.findOneID)

    app.use('/api/images', router)
}