const db = require("../models")
const Op = db.Sequelize.Op
const UserType = db.userType

exports.create = async (req, res) => {
    const data = req.body
    const usertype = {
        title: data.title,
        description: data.description,
    }

    UserType.create(usertype)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.findOne = (req, res) => {
    let title = req.body.title

    UserType.findOne({ where: { title: title } })
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

exports.findAll = (req, res) => {
    //search options
    UserType.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.update = (req, res) => {
    let data = req.body
    UserType.update(data.usertype, { where: { id: data.id } })
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
    UserType.destroy({ where: { id: data.id } })
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