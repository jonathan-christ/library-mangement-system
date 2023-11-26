const db = require("../models")
const Op = db.Sequelize.Op

const Copy = db.bookCopy

const rand = () => {
    return Math.floor(Math.random() * 900) + 100; // Generates a random 3-digit number
}

exports.create = async (req, res) => {
    const copy = {
        bookID: req.body.bookID,
        callNumber: req.body.callNumber + rand() // for implementation
    }

    Copy.create(copy)
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
    console.log(req.body)
    let val = req.body.bookID
    let condition = val ? { bookID: val } : null

    Copy.findAll({ where: condition })
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
    let callnum = req.body.callNumber

    Copy.findOne({ where: { callNumber: callnum } })
        .then(data => {
            res.status(200).send({
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
    Copy.findByPk(id)
        .then(data => {
            res.status(200).send({
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
    Copy.update(data.copy, { where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Copy updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    Copy.destroy({ where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Copy deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}