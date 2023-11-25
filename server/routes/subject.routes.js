module.exports = (app) => {
    const subject = require('../controllers/subject.controller.js')
    let router = require('express').Router()

    router.post("/create", subject.create)
    router.put("/update", subject.update)
    router.post("/delete", subject.delete)

    router.get("/", subject.findAll)
    router.post("/find", subject.findOne)

    app.use('/api/subjects', router)
}