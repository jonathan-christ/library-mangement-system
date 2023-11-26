const db = require("../models")
const Op = db.Sequelize.Op

const Copy = db.bookCopy

exports.create = async (req, res) => {
    const copy = {
        bookID: req.body.bookID,
        callNumber: null // for implementation
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
    Copy.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

// exports.findOne = (req, res) => {
//     //conditional
//     let name = req.body.name

//     Copy.findOne({ where: { name: name } })
//         .then(data => {
//             res.status(200).send({
//                 status: data ? 'found' : 'not found',
//                 data: data ? data : null
//             })
//         })
//         .catch(err => {
//             res.status(500)
//                 .send({ message: err.message })
//         })
// }

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