module.exports = (app) => {
    const fine = require('../controllers/fine.controller.js')
    let router = require('express').Router()

    router.post("/create", fine.create)
    router.put("/update", fine.update)
    router.post("/delete", fine.delete)

    router.post("/", fine.findAll)
    router.post("/find", fine.findOneID)

    app.use('/api/fines', router)
}