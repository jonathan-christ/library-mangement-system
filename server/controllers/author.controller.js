const db = require("../models")
const Op = db.Sequelize.Op
const Author = db.author
const AuthorList = db.authorList

exports.create = async (req, res) => {
    const data = req.body.data
    const author = {
        firstName: data.fname,
        lastName: data.lname,
        bio: data.bio
    }

    Author.create(author)
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
    Author.findAll()
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
    let fname = req.body.fname
    let lname = req.body.lname

    Author.findOne({ where: { firstName: fname, lastName: lname } })
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

    Author.findByPk(id)
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

exports.findBooksOf = (req, res) => {

}

exports.assignToBook = async (req, res, transaction) => {
    try {
        let data = req.body ? req.body.data : req.data

        const createdAuthorList = await AuthorList.create(
            { authorID: data.authorID, bookID: data.bookID },
            transaction
        )

        return createdAuthorList
    } catch (error) {
        console.error(error.message)

        try {
            res.status(500).send({ message: error.message })
        } catch (nestedError) {
            console.log("Error sending response: ", nestedError.message)
            return nestedError
        }
    }
}

exports.update = (req, res) => {

}

exports.delete = (req, res) => {

}

exports.deleteAll = (req, res) => {

}