module.exports = (app) => {
    const user = require('../controllers/user.controller.js')
    let router = require('express').Router()

    router.post("/create", user.create)
    router.put("/update", user.update)
    router.post("/delete", user.delete)
    
    router.post("/login", user.login)
    router.put("/changepass", user.changePass)
    router.post("/verifypass", user.verifyPass)
    
    router.get("/", user.findAll)
    router.post("/find", user.findOne)
    router.post("/findID", user.findOneID)

    app.use('/api/users', router)
}