const express = require('express')
const cors = require('cors')
const db = require('./models')
const ipconfig = require('./configs/ip.config')

const app = express()
const port = 5000

var corsOptions = {
    origin: "http://" + ipconfig.ip + port + 1
}

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    })

app.use(express.json())
app.use(cors())

//main function routes
require('./routes/library.routes')(app)

require('./routes/user.routes')(app)
require('./routes/usertype.routes')(app)

require('./routes/book.routes')(app)
require('./routes/author.routes')(app)
require('./routes/publisher.routes')(app)
require('./routes/genre.routes')(app)
require('./routes/subject.routes')(app)
require('./routes/rating.routes')(app)

//unknown get request
app.get('*', (req, res) => {
    res.send("404 not found")
})


app.listen(port, () => {
    console.log("Server started on port " + port)
})