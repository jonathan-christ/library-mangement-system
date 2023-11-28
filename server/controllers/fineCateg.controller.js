const db = require("../models")
const Op = db.Sequelize.Op

const FineCateg = db.fineCateg

exports.create = async (req, res) => {
    const fineCateg = {
        name: req.body.name,
        amount: req.body.amount,
        description: req.body.desc,
    }

    FineCateg.create(fineCateg)
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
    FineCateg.findAll()
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

    FineCateg.findOne({ where: { name: name } })
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

    FineCateg.findByPk(id)
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
    FineCateg.update(data.fineCateg, { where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "FineCateg updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    FineCateg.destroy({ where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Fine category deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}