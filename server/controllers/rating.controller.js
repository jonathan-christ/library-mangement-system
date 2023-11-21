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

exports.findBookRating = (req, res) => {
    Rating.findAll({ where: { bookID: req.body.bookID } })
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
            res.send({
                status: data ? 'found' : 'not found',
                data: data ? data : null
            })
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