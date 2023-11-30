module.exports = (app) => {
    const transaction = require('../controllers/transaction.controller.js')
    let router = require('express').Router()

    router.get("/tickets/test", transaction.test)
    router.get("/tickets/", transaction.findAllTickets)
    // router.get("tickets/find", transaction.findOneTicket)
    router.post("/tickets/create", transaction.createTicket)
    router.put("/tickets/update", transaction.updateTicket) // update for status & cancel

    app.use('/api/transactions', router)
}