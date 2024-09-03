const mongodb = require('./database/mongodb/db');
const query = require('./database/mongodb/query');

mongodb.connectDB();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

let users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/users', (req, res) => {
    query.getUsers().then((users) => {
        res.json(users);
    })
});

app.post('/users', (req, res) => {
    const user = req.body;
    console.log(req);
    query.createUser(user).then((user) => {
        res.status(201).json(user); 
    })
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params; // Extract the id from the request parameters
    const user = req.body; // Extract the updated user from the request body
    query.updateUser(id, user).then((user) => {
      res.status(200).json(user); // Respond with the updated user
    });
});

app.delete('/users/:id', (req, res) => {
const { id } = req.params; // Extract the id from the request parameters
query.deleteUser(id).then(() => {
    res.status(204).send(); // Respond with no content and status code 204
});
});

app.get('/users/search', (req, res) => {
    const { name } = req.query; // Extract the name query parameter

    // Check if the name query parameter is provided
    if (!name) {
    return res.status(400).send({ message: "Name query parameter is required" });
    }
    query.findUserByName(name).then((users) => {
    res.status(200).json(users); // Respond with the filtered users
    });    
});

app.get('/orders', (req, res) => {
    query.getOrders().then((orders) => {
        res.json(orders);
    })
});

app.post('/orders', (req, res) => {
    const order = req.body;
    console.log(req);
    query.createOrder(order).then((order) => {
        res.status(201).json(order); 
    })
});

app.put('/orders/:id', (req, res) => {
    const { id } = req.params;
    const order = req.body; 
    query.updateOrder(id, order).then((order) => {
        res.status(200).json(order); 
    });
});

app.delete('/orders/:id', (req, res) => {
const { id } = req.params;
query.deleteOrder(id).then(() => {
    res.status(204).send(); 
    });
});

app.get('/orders/search', (req, res) => {
    const { name } = req.query;
    
    if (!name) {
    return res.status(400).send({ message: "Name query parameter is required" });
    }
    query.findOrderByName(name).then((orders) => {
    res.status(200).json(orders); 
    });    
});