const db = require("../models")
const Bottleneck = require('bottleneck');

const User = db.user

const Book = db.book
const BookCopy = db.bookCopy
const Classification = db.classification

const Fine = db.fine
const FineCateg = db.fineCateg
const Ticket = db.ticket

const Op = db.Sequelize.Op
const { v4: uuidv4 } = require('uuid')

const { fineMappings } = require('../assets/constants/fineClass')
const { borrowPeriod, reservePeriod } = require('../assets/constants/timePeriods')
const { dateDiff, convertMilliTo } = require('../assets/helper functions/timeConversion')

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000,
})


exports.findAllTickets = async (req, res) => {
    try {
        const result = await Ticket.findAll({
            include: [
                {
                    model: Book,
                    attributes: ['title'],
                },
                {
                    model: BookCopy,
                    attributes: ['callNumber'],
                    required: false
                },
                {
                    model: User,
                    attributes: [
                        [
                            db.sequelize.literal('CONCAT(User.firstName, " ", User.lastName)'),
                            'userName'
                        ],
                    ]
                }
            ],
        })

        res.send(result)

    } catch (error) {
        res.status(500).send('Error finding tickets! ' + error.message)
    }
}
// TRANSACTION

exports.createTicket = async (req, res) => {
    let data = req.body;

    try {
        let ticket = null
        const result = await db.sequelize.transaction(async (t) => {
            const hasCopies = await BookCopy.findOne({
                where: { bookID: data.bookID, status: 'good' },
                transaction: t
            })

            if (hasCopies) {
                const ticketData = {
                    uuid: uuidv4(),
                    userID: data.id,
                    bookID: data.bookID,
                }

                ticket = await Ticket.create(ticketData, { transaction: t })
                await checkQueueAndReserve()
            } else {
                return res
                    .status(400)
                    .send("No available book copies for reservation.")
            }
        })
        return res.status(201).send(ticket)

    } catch (error) {
        res.status(500).send("Error in creating ticket! " + error.message)
    }
}

exports.updateTicket = async (req, res) => {
    const data = req.body
    const endTicket = ['closed', 'cancelled']

    console.log(data)
    try {
        const result = await db.sequelize.transaction(async (t) => {

            const ticket = await Ticket.findOne({ where: { id: data.id }, transaction: t })
            if (ticket.copyID) {
                if (endTicket.includes(data.status)) {
                    await BookCopy.update(
                        { available: "yes" },
                        {
                            where: { id: ticket.copyID },
                            transaction: t
                        }
                    )
                    if (data.status === 'closed') {
                        ticket.returnDate = new Date()
                    }
                    await checkQueueAndReserve()
                }
                if (data.status === 'borrowed') {
                    ticket.lendDate = new Date()
                }
            }
            ticket.status = data.status
            await ticket.save({ transaction: t })
        })
        return res.status(201).send(result)
    } catch (error) {
        return res.status(500).send(`Error updating ticket to ${data.status} ${error.message}`)
    }
}

// LOOPING FUNCTIONS
const checkQueueAndReserve = async () => {
    try {
        const result = await db.sequelize.transaction(async (t) => {
            console.log('[checkQueueAndReserve] Start')
            const availCopies = await BookCopy.findAll({
                where: { status: 'good', available: 'yes' },
                transaction: t
            })

            if (availCopies) {
                const updateTicketList = []

                //check all tickets of book copy's book
                for (const copy of availCopies) {
                    const frontTicket = await Ticket.findOne({
                        where: { status: 'queued', bookID: copy.bookID },
                        order: [['createDate', 'ASC']]
                    })
                    //first in line gets updated first
                    if (frontTicket) {
                        updateTicketList.push({
                            id: frontTicket.id,
                            status: 'reserved',
                            reserveDate: new Date(),
                            copyID: copy.id
                        })
                        await copy.update({ available: 'no', id: copy.id }, { transaction: t })

                    }
                }
                console.log(updateTicketList.length)
                if (updateTicketList.length > 0) {
                    await limiter.schedule(async () => {
                        await Ticket.bulkCreate(updateTicketList, { updateOnDuplicate: ['status', 'reserveDate', 'copyID'], transaction: t })
                    })
                    return console.log("[checkQueueAndReserve] Tickets have been assigned")
                }
            }
        })
        console.log("[checkQueueAndReserve] No tickets assigned")
    } catch (error) {
        console.log("Error in checkQueueAndReserve:" + error.message)
    }
}

//periodical check functions

//check overdue reserved (cancel them)
const checkReservedTickets = async () => {
    try {
        const result = await db.sequelize.transaction(async (t) => {
            console.log("[checkReservedTickets] Running ")
            const reservedTickets = await Ticket.findAll({
                where: { status: 'reserved' },
                transaction: t
            })

            if (reservedTickets) {
                const updateTicketList = []

                for (const ticket of reservedTickets) {
                    const dateDiffMilli = dateDiff(ticket.reserveDate, new Date())
                    const dateDiffDays = convertMilliTo(dateDiffMilli, 'day')

                    //check if not picked up in reserve period
                    if (dateDiffDays >= reservePeriod) {
                        updateTicketList.push({
                            id: ticket.id,
                            status: 'closed',
                        })
                        await BookCopy.update({ available: 'yes' }, { where: { id: ticket.copyID }, transaction: t })
                    }
                }

                //update in bulk if ther are entries
                if (updateTicketList.length > 0) {
                    await limiter.schedule(async () => {
                        await Ticket.bulkCreate(updateTicketList, { updateOnDuplicate: ['status'], transaction: t })
                    })
                    return console.log("[checkReservedTickets] Some tickets have been cancelled")
                }
            }
        })
        console.log("[checkReservedTickets] No tickets updated")
    } catch (error) {
        console.log("Error in checkReservedTickets:" + error.message)
    }
}

//check overdue borrowed tickets
const checkBorrowedTickets = async () => {
    try {
        const result = await db.sequelize.transaction(async (t) => {
            console.log("[checkBorrowedTickets] Running")
            const borrowedTickets = await Ticket.findAll({
                include: [{
                    model: Book,
                    include: [{
                        model: Classification,
                        attributes: ['name'],
                        where: { bookID: db.Sequelize.col('Book.id') }
                    }],
                    attributes: ['classificationID'],
                    where: { id: db.Sequelize.col('Ticket.bookID') },
                }],
                where: { status: 'borrowed' },
                transaction: t
            })

            if (borrowedTickets) {
                const updateTicketList = []
                for (const ticket of borrowedTickets) {
                    const dateDiffMilli = dateDiff(ticket.lendDate, new Date())
                    const dateDiffDays = convertMilliTo(dateDiffMilli, 'day')
                    const className = ticket.book.classification.name.toUpperCase()
                    const borrowTime = borrowPeriod[className]

                    console.log("[something] " + JSON.stringify(ticket))
                    if (dateDiffDays >= borrowTime) {
                        console.log("[yes]")
                        updateTicketList.push({
                            id: ticket.id,
                            status: 'overdue',
                        })

                        const category = await FineCateg.findOne({
                            where: { name: { [Op.like]: fineMappings[className]['overdue'] } },
                            attributes: ['id']
                        })
                        await Fine.create({
                            ticketID: ticket.id,
                            categID: category.id
                        }, { transaction: t })
                    }
                }
                if (updateTicketList.length > 0) {
                    await limiter.schedule(async () => {
                        await Ticket.bulkCreate(updateTicketList, { updateOnDuplicate: ['status'], transaction: t })
                    })
                    console.log("[checkBorrowedTickets] Some tickets have been updated")
                }
            }
        })
        console.log("[checkBorrowedTickets] No tickets updated")
    } catch (error) {
        console.log("Error in checkBorrowedTickets:" + error.message)
    }
}


exports.copiesAndTickets = async (req, res) => {
    // const copy = await BookCopy.findAll({
    //     include: [{
    //         model: Ticket,
    //         where: { status: 'queued' },
    //         order: [['createDate', 'ASC']],
    //         //required: true, // Use left join to get copies even without tickets
    //     }],
    //     where: { status: 'good', available: 'yes' },
    // })

    // const copy = await Ticket.findAll({
    //     include: [{
    //         model: BookCopy,
    //         where: { bookID: db.Sequelize.col('Ticket.bookID') },
    //     }],
    // })
    // res.send(copy)



}


exports.test = async (req, res) => {
    let msg = await checkQueueAndReserve()
    msg += ' ' + await checkReservedTickets()
    msg += ' ' + await checkBorrowedTickets()
    
    // const msg = await Ticket.findAll({
    //     include: [{
    //         model: Book,
    //         // include: [{
    //         //     model: Classification,
    //         //     attributes: ['name'],
    //         //     where: { id: db.Sequelize.col('Book.classificationID') }
    //         // }],
    //         attributes: ['classificationID'],
    //         where: { id: db.Sequelize.col('Ticket.bookID') },
    //     }],
    //     where: { status: 'borrowed' }
    // })
    res.send(msg)
}