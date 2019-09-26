const mongoose = require('mongoose')

const planetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    climate: {
        type: String,
        required: true
    },
    terrain: {
        type: String,
        required: true,
    },
    films: {
        type: Number,
        required: false,
    }
})

module.exports = mongoose.model('Planet', planetSchema)