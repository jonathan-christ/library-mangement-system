const multer = require('multer')
const path = require('path')

const db = require("../models")
const Op = db.Sequelize.Op
const Image = db.bookImg

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')  // specify the directory for storing images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

exports.create = (req, res) => {
    upload.single('bookImg')(req, res, (err) => {
        if (err) {
            return res.status(500).send({ message: "Bitch" + err.message })
        }
        const { uploaderID } = req.body
        const imgLink = `/images/${req.file.filename}`

        console.log(req.file.path)
        Image.create({ uploaderID, imgLink })
            .then(() => {
                res.status(201).send({
                    status: 'created'
                })
            })
            .catch(err => {
                res.status(500).send({ message: err })
            })
    })
}

exports.findAll = (req, res) => {
    // search options
    Image.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.findOne = (req, res) => {
    // options
    let title = req.body.title

    Image.findOne({ where: { title: title } })
        .then(data => {
            res.status(200).send({
                status: data ? 'found' : 'not found',
                data: data ? data : null
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.findOneID = (req, res) => {
    // options
    let id = req.body.id

    Image.findByPk(id)
        .then(data => {
            res.status(200).send({
                status: data ? 'found' : 'not found',
                data: data ? data : null
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.update = (req, res) => {
    const id = req.body.id
    const value = req.body.title

    Image.update({title: value}, { where: { id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: 'Image was updated successfully.' })
            } else {
                res.send({ message: `Image not found!` })
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.delete = (req, res) => {
    const id = req.body.id

    Image.destroy({ where: { id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: 'Image was deleted successfully.' })
            } else {
                res.send({ message: `Image not found!` })
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
} 