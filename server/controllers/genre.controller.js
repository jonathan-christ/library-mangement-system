const db = require("../models")
const Op = db.Sequelize.Op

const Genre = db.genre
const GenreList = db.genreList

exports.create = async (req, res) => {
    const genre = {
        name: req.body.name,
        description: req.body.desc,
    }

    Genre.create(genre)
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
    Genre.findAll()
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

    Genre.findOne({ where: { name: name } })
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

    Genre.findByPk(id)
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
exports.update = (req, res) => {
    let data = req.body
    Genre.update(data.genre, { where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Genre updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    Genre.destroy({ where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Genre deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}