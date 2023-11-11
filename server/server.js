const express = require('express')
const cors = require('cors')
const db = require('./models')

const app = express()
const port = 5000


app.get('/login', (req, res)=>{
    res.json({"users": ["1","2","3"]})
})

//unknown get request
app.get('*', (res)=>{
    res.send("404 not found")
})

app.listen(port, ()=>{
    console.log("Server started on port "+ port)
})