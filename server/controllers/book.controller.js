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
        }

        const createdBook = await Book.create(book, transaction)
        let result = { data: createdBook }
        return (req.transact ?? true) ? result : res.status(200).send(result)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }

}

exports.findAll = async (req, res) => {
    try {
        const books = await Book.findAll()
        res.send(books);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.findOne = (req, res) => {
    //conditional
    let isbn = req.body.isbn
    Book.findOne({ where: { isbn: isbn } })
        .then(data => {
            res.send({
                status: data ? 'found' : 'not found',
                data: data ? data : null
            })
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
            res.send({
                status: data ? 'found' : 'not found',
                data: data ? data : null
            })
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