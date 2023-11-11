const express = require('express')
const cors = require('cors')
const db = require('./models')

const app = express()
const port = 5000

var corsOptions = {
    origin: "http://localhost:" + port + 1
}

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    })

require('./routes/user.routes')(app)

app.get('/login', (req, res) => {
    res.json({ "users": ["1", "2", "3"] })
})

//unknown get request
app.get('*', (req, res) => {
    res.send("404 not found")
})


app.listen(port, () => {
    console.log("Server started on port " + port)
})