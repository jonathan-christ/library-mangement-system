module.exports = (app) => {
    const user = require('../controllers/user.controller.js')
    let router = require('express').Router()

    router.post("/create", user.create)
    router.post("/login", user.login)

    router.get("/", user.findAll)
    router.post("/find", user.findOne)

    app.use('/api/users', router)
}