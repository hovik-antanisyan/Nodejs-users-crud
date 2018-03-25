const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    dob: {type: Date, required: true},
    address: String,
    address2: String,
    country: String,
    city: String,
    postalCode: String
});

module.exports = mongoose.model('user', userSchema);
