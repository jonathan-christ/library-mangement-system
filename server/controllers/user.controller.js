const db = require("../models");
const Op = db.Sequelize.Op
const User = db.user

//testing only for now

exports.create = (req, res) => {
    let body = req.body

    const user = {
        typeID: 1,
        firstName: "Cock And",
        middleName: "Ball",
        lastName: "Torture",
        suffix: "",
        sex: "male",
        email: "rufgier@gmail.com",
        password: '12345'
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
    let email = req.query.email
    let condition = email ? { email: { [Op.like]: `%${email}` } } : null

    User.findAll({ where: condition })
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
    let id = req.params.id

    User.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data)
            } else {
                res.status(404)
                    .send({ message: "Cannot find user" })
            }
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message })
        })
}

exports.update = (req, res) => {

}

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

}

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

}

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

}


