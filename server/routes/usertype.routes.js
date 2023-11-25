module.exports = (app) => {
    const userType = require('../controllers/userType.controller.js')
    let router = require('express').Router()

    router.post("/create",  userType.create )
    router.put("/update", userType.update)
    router.post("/delete", userType.delete)

    router.get("/",  userType.findAll )
    router.post("/find",  userType.findOne )

    app.use('/api/usertypes', router)
}