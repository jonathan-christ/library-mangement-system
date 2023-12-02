const db = require("../models");
const Notification = db.notification

exports.create = async (req, res) => {
    const data = req.body;
    const notification = {
        userID: data.userID,
        ticketID: data.ticketID,
        text: data.text,
    }

    Notification.create(notification)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message })
        })
}

exports.findAll = (req, res) => {
    console.log(req.body)
    Notification.findAll({ where: { userID: req.body.userID }, order: [['sendDate', 'DESC']] })
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send({ message: err.message })
        })
};

exports.update = (req, res) => {
    const data = req.body;
    Notification.update({ isRead: true }, { where: { userID: data.userID, id: data.id } })
        .then(() => {
            res.status(200).send({
                message: "Notification updated!",
            })
        })
        .catch((err) => {
            res.status(500).send({ message: err.message })
        })
};

exports.delete = (req, res) => {
    const data = req.body;
    Notification.destroy({ where: { userID: data.userID, id: data.notificationID } })
        .then(() => {
            res.status(200).send({
                message: "Notification deleted!",
            })
        })
        .catch((err) => {
            res.status(500).send({ message: err.message })
        })
}