module.exports = (app) => {
    const user = require('../controllers/user.controller.js')
    let router = require('express').Router()

    router.post("/", user.create)
    router.get("/", user.findAll)

    app.use('/api/users', router)
}