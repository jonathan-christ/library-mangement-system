const db = require("../models")
const Op = db.Sequelize.Op
const Publisher = db.publisher

exports.create = async (req, res) => {
    const data = req.body.data
    const publisher = {
        name: data.name,
        address: data.address
    }

    Publisher.create(publisher)
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
    Publisher.findAll()
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
    let name = req.body.name

    Publisher.findOne({ where: { name: name } })
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

    Publisher.findByPk(id)
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
    Publisher.update(data.publisher, { where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Publisher updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    Publisher.destroy({ where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Publisher deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}