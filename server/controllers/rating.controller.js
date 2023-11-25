const db = require("../models")
const Op = db.Sequelize.Op
const Rating = db.rating

exports.create = async (req, res) => {
    const data = req.body
    const rating = {
        bookID: data.bookID,
        userID: data.userID,
        rating: data.rating
    }

    Rating.create(rating)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.findBookRating = (req, res) => {
    Rating.findAll({
        attributes: [
            [
                db.sequelize.literal("COUNT(*)"),
                'count'
            ],
            [
                db.sequelize.literal("SUM(CASE WHEN rating = 'like' THEN 1 ELSE 0 END)"),
                'score'
            ]
        ],
        where: { bookID: req.body.bookID },
        group: ['bookID']
    })
        .then(data => {
            res.send(data[0])
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.findUserBookRating = (req, res) => {
    Rating.findOne({ where: { userID: req.body.userID, bookID: req.body.bookID }, attributes: ['rating'] })
        .then(data => {
            res.send({
                status: data ? 'found' : 'not found',
                rating: data?.rating ?? 'none'
            })
        }).catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.update = (req, res) => {
    let data = req.body
    Rating.update({ rating: data.rating }, { where: { userID: data.userID, bookID: data.bookID } })
        .then(() => {
            res.status(200).send({
                message: "Rating updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    Rating.destroy({ where: { userID: data.userID, bookID: data.bookID } })
        .then(() => {
            res.status(200).send({
                message: "Rating deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}