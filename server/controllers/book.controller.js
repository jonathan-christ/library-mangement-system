const db = require("../models");
const Op = db.Sequelize.Op;
const Book = db.book;

exports.create = async (req, res, transaction) => {
    try {
        const data = req.body ? req.body.data : req.data;
        const book = {
            isbn: data.isbn,
            title: data.title,
            description: data.desc,
            publisherID: data.publisherID,
            publishDate: data.publishDate,
        };

        const createdBook = await Book.create(book, transaction )
        return { data: createdBook }
    } catch (error) {
        console.error(error.message)

        try {
            res.status(500).send({ message: error.message })
        } catch (nestedError) {
            console.log("Error sending response: ", nestedError.message)
            return { message: error.message }
        }
    }

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
    let isbn = req.body.isbn

    Book.findOne({ where: {isbn: isbn} })
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