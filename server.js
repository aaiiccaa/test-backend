require('dotenv').config();

const mongodb = require('./database/mongodb/db');
const userQuery = require('./database/mongodb/query'); 

mongodb.connectDB();

// Import the express module to create and configure the HTTP server
const express = require('express');
// Import the body-parser middleware to parse incoming request bodies
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Import the verifyToken middleware to authenticate JWT tokens
const verifyToken = require('./middlewares/jwt');
// Import the passport middleware to authenticate and configure the passport authentication
const { initializePassport, authenticatePassportJwt } = require('./middlewares/passport-jwt');

// Initialize an Express application
const app = express();
// Define the port number on which the server will listen
const PORT = 3000;
// Initialize Passport
app.use(initializePassport());


// Initialize an array to store user data
let users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Route to GET all users - returns the users array as JSON
app.get('/users', (req, res) => {
  userQuery.getUsers().then((users) => {
    res.json(users);
  });
});

// Route to POST a new user - adds a new user to the users array
app.post('/users', (req, res) => {
  const user = req.body; // Extract the user from the request body
  console.log(req);
  userQuery.createUser(user).then((user) => {
    res.status(201).json(user); // Respond with the created user and status code 201
  })
});
  

// Route to PUT (update) a user by id
app.put('/users/:id', (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  const user = req.body; // Extract the updated user from the request body
  userQuery.updateUser(id, user).then((user) => {
    res.status(200).json(user); // Respond with the updated user
  });
});

// Route to DELETE a user by id
app.delete('/users/:id', (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  userQuery.deleteUser(id).then(() => {
    res.status(204).send(); // Respond with no content and status code 204
  });
});

// Route to search users by name
app.get('/users/search', (req, res) => {
    const { name } = req.query; // Extract the name query parameter
  
    // Check if the name query parameter is provided
    if (!name) {
      return res.status(400).send({ message: "Name query parameter is required" });
    }
    userQuery.findByName(name).then((users) => {
      res.status(200).json(users); // Respond with the filtered users
    });    
});

app.post('/users/register', (req, res) => {
  const user = req.body;
  userQuery.createUser(user).then((user) => {
    res.status(201).json(user);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const payload = { email, password };
    const token = await login(payload);
    res.status(200).json({ message: "Success login!", token });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

async function login(payload) {
  try {
    const checkUser = await userQuery.findOneByEmail(payload.email);
    if (!checkUser) {
      throw new Error('Invalid email or password');
    }
    const user = {
      userId: checkUser.user_id,
      email: checkUser.email,
      password: checkUser.password
    };
    const isValidPassword = bcrypt.compareSync(payload.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    const key = process.env.JWT_SECRET || 'default_secret_key';
    const token = jwt.sign(user, key, { expiresIn: '30m' });
    return token;
  } catch (error) {
    console.error('Error login: ', error);
    throw error;
  }
}

// Route to GET all orders - returns the orders array as JSON
app.get('/orders', verifyToken, (req, res) => {
  userQuery.getOrders().then((orders) => {
    res.json(orders);
  });
});

// Route to POST a new order - adds a new order to the orders array
app.post('/orders', verifyToken, (req, res) => {
  const order = req.body; // Extract the order from the request body
  userQuery.createOrder(order).then((order) => {
    res.status(201).json(order); // Respond with the created order and status code 201
  });
});

// Route to PUT (update) an order by id
app.put('/orders/:id', (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  const order = req.body; // Extract the updated order from the request body
  userQuery.updateOrder(id, order).then((order) => {
    res.status(200).json(order); // Respond with the updated order
  });
});

// Route to DELETE an order by id
app.delete('/orders/:id', authenticatePassportJwt(), (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  userQuery.deleteOrder(id).then(() => {
    res.status(204).send(); // Respond with no content and status code 204
  });
});

// Route to search orders by status
app.get('/orders/search', (req, res) => {
  const { status } = req.query; // Extract the status query parameter

  // Check if the status query parameter is provided
  if (!status) {
    return res.status(400).send({ message: "Status query parameter is required" });
  }
  userQuery.findByStatus(status).then((orders) => {
    res.status(200).json(orders); // Respond with the filtered orders
  });
});

// Route to find an order by orderId
app.get('/orders/:orderId', (req, res) => {
  const { orderId } = req.params; // Extract the orderId from the request parameters
  userQuery.findOneByOrderId(orderId).then((order) => {
    res.status(200).json(order); // Respond with the found order
  });
});