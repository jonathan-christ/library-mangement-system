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

    User.findByPk(id)
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
        }).catch((err)=>{
            res.status(500).send(err)
        })
}


