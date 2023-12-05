const db = require("../models");
const Op = db.Sequelize.Op;
const Book = db.book;
const BookCopy = db.bookCopy

exports.create = async (req, res, transaction) => {
    try {
        const data = req.body ? req.body.data : req.data;
        const book = {
            isbn: data.isbn,
            title: data.title,
            pages: data.pages,
            baseCallNumber: data.bcn,
            description: data.desc,
            imageID: data.imageID,
            classificationID: data.classificationID,
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

exports.findAllHasCopies = async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [{
                model: BookCopy,
                required: true,
                where: { status: 'good' }
            }],
            where: { deleted: false }
        })
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

exports.delete = (req, res) => {
    let id = req.body.id
    Book.update({ deleted: true }, { where: { id: id, deleted: false } })
        .then((rows) => {
            res.status(rows[0] === 1 ? 200 : 404).send({
                message: rows[0] === 1 ? "Book deleted!" : "Book not found!",
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.count = async (req, res) => {
    try {
        const bookCount = await Book.count()
        console.log(`Number of Books: ${bookCount}`)
        res.send({data: bookCount})
    } catch (error) {
        console.error('Error fetching book count:', error)
        res.status(500).send(error)
    }
}