const { Sequelize, fineCateg } = require("../models")
const db = require("../models")
const Op = db.Sequelize.Op

const User = db.user
const Ticket = db.ticket
const Fine = db.fine
const FineCateg = db.fineCateg

exports.create = async (req, res) => {
    const fine = {
        ticketID: req.body.ticketID,
        categID: req.body.categID,
    }

    Fine.create(fine)
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
    let data = req.body.userID
    Fine.findAll({
        include: [
            {
                model: Ticket,
                include: [{
                    model: User,
                    attributes: ['firstName', 'lastName']
                }],
                attributes: ['uuid', 'lendDate'],
                where: data ? { userID: data } : {},
                require: true
            },
            {
                model: FineCateg,
                attributes: ['name', 'amount', 'frequency']
            }
        ],
    })
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

//     Fine.findOne({ where: { name: name } })
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

    Fine.findByPk(id)
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
    console.log(data, data.status, data.payDate)
    Fine.update({ status: data.status, payDate: data.payDate }, { where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Fine record updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let data = req.body
    Fine.destroy({ where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Fine record deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}