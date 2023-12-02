module.exports = (app) => {
    const notification = require('../controllers/notification.controller.js')
    let router = require('express').Router()

    router.post("/create", notification.create)
    router.post("/find", notification.findAll)
    router.put("/update", notification.update)
    router.delete("/delete", notification.delete)

    app.use('/api/notifications', router)
}
