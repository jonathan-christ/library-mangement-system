const schedule = require('node-schedule');
const { routineCheck } = require('./controllers/transaction.controller'); // Adjust the path as needed

// Schedule the routine task every 5 seconds
routineCheck()
const job = schedule.scheduleJob('*/5 * * * *', routineCheck);