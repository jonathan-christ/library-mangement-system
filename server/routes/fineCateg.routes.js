module.exports = (app) => {
    const fineCateg = require('../controllers/fineCateg.controller.js')
    let router = require('express').Router()

    router.post("/create", fineCateg.create)
    router.put("/update", fineCateg.update)
    router.post("/delete", fineCateg.delete)

    router.get("/", fineCateg.findAll)
    router.post("/find", fineCateg.findOne)

    app.use('/api/fineCategs', router)
}