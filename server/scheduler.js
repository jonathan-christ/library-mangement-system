const schedule = require('node-schedule')
const { routineCheck } = require('./controllers/transaction.controller')

routineCheck()

//every 5 mins run this
const job = schedule.scheduleJob('*/5 * * * *', routineCheck)