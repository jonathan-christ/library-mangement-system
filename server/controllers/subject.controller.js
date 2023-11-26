const db = require("../models")
const Op = db.Sequelize.Op

const Subject = db.subject
const SubjectList = db.subjectList

exports.create = async (req, res) => {
    const subject = {
        name: req.body.name,
        description: req.body.desc,
    }

    Subject.create(subject)
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
    Subject.findAll()
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

    Subject.findOne({ where: { name: name } })
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

    Subject.findByPk(id)
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
    Subject.update(data.Subject, { where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Subject updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    Subject.destroy({ where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Subject deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}