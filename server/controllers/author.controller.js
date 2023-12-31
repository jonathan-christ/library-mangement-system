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

    Author.findByPk(id)
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
    let data = req.body
    Author.update(data.author, { where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "User type updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    Author.destroy({ where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "User type deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}
