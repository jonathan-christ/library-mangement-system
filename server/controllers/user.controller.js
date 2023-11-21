const db = require("../models")
const bcrypt = require("bcrypt")
const Op = db.Sequelize.Op
const User = db.user

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
    User.findAll()
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
    let condition = email ? { email: { [Op.eq]: email } } : null

    User.findOne({ where: condition })
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

    User.findByPk(id)
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

}

exports.delete = (req, res) => {

}

exports.deleteAll = (req, res) => {

}


exports.login = async (req, res) => {
    let email = req.body.email
    let pass = req.body.password
    let condition = email ? { email: { [Op.eq]: email } } : null

    User.findAll({ where: condition })
        .then(data => {
            if (data.length == 1) {
                let userData = data[0].dataValues
                let hash = Buffer.from(userData.password).toString()
                bcrypt.compare(pass, hash).then(match => {
                    if (match) {
                        res.send({
                            status: 'pass_match',
                            data: userData
                        })
                    } else {
                        res.send({
                            status: 'pass_mismatch'
                        })
                    }
                })

            } else {
                res.send({
                    status: 'not found'
                })
            }
        })
}


