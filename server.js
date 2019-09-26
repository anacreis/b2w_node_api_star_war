require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

// mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
mongoose.connect('mongodb://localhost/starwars', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())

const planetRouter = require('./routes/planet')
app.use('/planets', planetRouter)

app.listen(3000, () => console.log('server started'))

app.on('testEvent', function (data) {
    return console.log(data);
});
