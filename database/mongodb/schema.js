const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String
});

const orderSchema = new mongoose.Schema({
    _id: String,
    name: String,
    date: String
});

module.exports = {
    userSchema,
    orderSchema
}