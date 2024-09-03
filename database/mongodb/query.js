const mongoose = require('mongoose');
const schema = require('./schema');

const Users = mongoose.model('User', schema.userSchema);
const Orders = mongoose.model('Order', schema.orderSchema);

async function getUsers(){
    return Users.find();
}

async function createUser(user){
    return Users.create(user);
}

async function updateUser(id, user) {
    return Users.findByIdAndUpdate(id, user, { new: true});
}

async function deleteUser(id){
    return Users.findByIdAndDelete(id);
}

async function findUserByName(name){
    return Users.find({ name: name });
}

async function getOrders(){
    return Orders.find();
}

async function createOrder(order){
    return Orders.create(order);
}

async function updateOrder(id, order) {
    return Orders.findByIdAndUpdate(id, order, { new: true});
}

async function deleteOrder(id){
    return Orders.findByIdAndDelete(id);
}

async function findOrderByName(name){
    return Orders.find({ name: name });
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    findUserByName,
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    findOrderByName
}