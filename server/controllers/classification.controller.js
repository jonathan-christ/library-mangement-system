const db = require("../models")
const Op = db.Sequelize.Op

const Classification = db.classification

exports.create = async (req, res) => {
    const classification = {
        name: req.body.name,
        description: req.body.description,
    }

    Classification.create(classification)
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
    Classification.findAll()
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

    Classification.findOne({ where: { name: name } })
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

    Classification.findByPk(id)
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
    Classification.update(data.classification, { where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Classification updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    Classification.destroy({ where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Classification deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}