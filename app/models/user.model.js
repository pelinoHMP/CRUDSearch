const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    quan: Number,
    prio: Number,
    price: Number
});
module.exports = mongoose.model('items', UserSchema)
