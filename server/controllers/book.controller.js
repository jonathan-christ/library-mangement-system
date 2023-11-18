const db = require("../models")
const Op = db.Sequelize.Op
const Book = db.book

exports.create = async (req, res) => {
    const data = req.body.data
    const book = {
        isbn: data.isbn, //
        title: data.title,
        description: data.desc,
        publisherID: data.publisherID, //gotta validate
        publishDate: data.publishDate,
    }

    Book.create(book, { transaction: t }).then(data => {
        res.send(data)
    })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })

}

exports.findAll = (req, res) => {
    //search options
    Book.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.findOne = (req, res) => {
    //conditional
    let value = req.body.value
    let searchCon = req.body.condition
    let condition = value ? { searchCon: { [Op.eq]: value } } : null

    Book.findOne({ where: condition })
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
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.findOneID = (req, res) => {
    //options
    let id = req.body.id

    Book.findByPk(id)
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
        })
        .catch(err => {
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