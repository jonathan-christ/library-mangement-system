const db = require("../models")
const bcrypt = require("bcrypt")
const Op = db.Sequelize.Op
const User = db.user

const exclude = {exclude: ['password', 'deleted']}

exports.create = async (req, res) => {
    const data = req.body.data
    const user = {
        typeID: 1,
        firstName: data.fname,
        middleName: data.mname,
        lastName: data.lname,
        suffix: data.suffix,
        sex: data.sex,
        email: data.email,
        password: await bcrypt.hash(data.password, 10)
    }

    User.create(user)
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
    User.findAll({ where: { deleted: 'false' }, attributes: exclude })
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.findOne = (req, res) => {
    //options
    let email = req.body.email
    let condition = { email: { [Op.eq]: email }, deleted: 'false' }

    User.findOne({ where: condition, attributes: exclude })
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

exports.findOneID = async (req, res) => {
    //options
    let id = req.body.id

    User.findOne({ where: { id: id }, attributes: exclude })
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

exports.update = async (req, res) => {
    let data = req.body
    User.update(data.user, { returning: true, plain: true, where: { id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "User updated!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    let id = req.body.id
    User.update({ deleted: 'true' }, { where: { id: id, deleted: 'false' } })
        .then((rows) => {
            res.status(rows[0] === 1 ? 200 : 404).send({
                message: rows[0] === 1 ? "User deleted!" : "User not found!",
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.deleteAll = (req, res) => {
    User.update({ deleted: 'true' })
        .then(() => {
            res.status(200).send({
                message: "User deleted!"
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}


exports.login = async (req, res) => {
    let email = req.body.email
    let pass = req.body.password
    let condition = { email: { [Op.eq]: email }, deleted: 'false' }

    User.findAll({ where: condition })
        .then(data => {
            if (data.length == 1) {
                let userData = data[0].dataValues
                let hash = Buffer.from(userData.password).toString()
                bcrypt.compare(pass, hash).then(match => {
                    res.status(200).send({
                        status: match ? 'pass_match' : 'pass_mismatch',
                        data: match ? userData : undefined
                    })
                })

            } else {
                res.status(200).send({
                    status: 'user not found'
                })
            }
        }).catch((err) => {
            res.status(500).send(err)
        })
}

exports.changePass = async (req, res) => {
    const id = req.body.id
    const pass = await bcrypt.hash(req.body.password, 10)
    User.update({ password: pass }, { where: { id: id, deleted: 'false' } })
        .then((rows) => {
            res.status(rows[0] === 1 ? 200 : 404).send({
                message: rows[0] === 1 ? `User password updated!` : "User not found!",
            })
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.verifyPass = async (req, res) => {
    const id = req.body.id
    let pass = req.body.password
    let condition = { id: id, deleted: 'false' }

    User.findAll({ where: condition, attributes: ['password'] })
        .then(data => {
            if (data.length == 1) {
                let userData = data[0].dataValues
                let hash = Buffer.from(userData.password).toString()
                bcrypt.compare(pass, hash).then(match => {
                    res.status(200).send({
                        status: match ? 'pass_match' : 'pass_mismatch',
                    })
                })

            } else {
                res.status(200).send({
                    status: 'user not found'
                })
            }
        }).catch((err) => {
            res.status(500).send(err)
        })
}


