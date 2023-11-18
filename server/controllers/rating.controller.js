const db = require("../models")
const Op = db.Sequelize.Op
const Rating = db.rating

exports.create = async (req, res) => {
    const data = req.body.data
    const Rating = {
        bookID: data.bookID,
        userID: data.userID,
        value: data.value
    }

    Rating.create(Rating)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.findAll = (req, res) => {
    //search options
    Rating.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.findUserBookRating = (req, res) => {

    Rating.findOne({ where: { userID: req.body.userID, bookID: req.body.bookID } })
        .then(data => {
            if (data) {
                res.send({
                    status: 'found',
                    data: data
                })
            } else {
                res.send({
                    status: 'not found',
                    data: null
                })
            }
        }).catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.update = (req, res) => {

}

exports.delete = (req, res) => {

}

exports.deleteAll = (req, res) => {

}