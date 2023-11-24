module.exports = (app) => {
    const rating = require('../controllers/rating.controller.js')
    let router = require('express').Router()

    router.post("/create",  rating.create )
    router.put("/update", rating.update)

    router.post("/find",  rating.findBookRating )
    router.post("/find/user",  rating.findUserBookRating )

    app.use('/api/ratings', router)
}