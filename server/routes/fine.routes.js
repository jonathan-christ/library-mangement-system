// module.exports = (app) => {
//     const fine = require('../controllers/fine.controller.js')
//     let router = require('express').Router()

//     router.post("/create", fine.create)
//     router.put("/update", fine.update)
//     router.post("/delete", fine.delete)

//     router.get("/", fine.findAll)
//     router.post("/find", fine.findOne)

//     app.use('/api/fines', router)
// }