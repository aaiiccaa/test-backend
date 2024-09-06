require('dotenv').config();

const mongodb = require('./database/mongodb/db');
const userQuery = require('./database/mongodb/query');
const companyQuery = require('./database/mongodb/query'); 

mongodb.connectDB();

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initializePassport, authenticatePassportJwt } = require('./middlewares/passport-jwt');

const app = express();
const port = 3000;
const host = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0'

app.use(initializePassport());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});

/**
 * User Routes
 */

// Get all users
app.get('/users', authenticatePassportJwt(), (req, res) => {
    userQuery.getUsers().then((users) => {
        res.json(users);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Create a new user (registration)
app.post('/users/register', (req, res) => {
  const user = req.body;
  userQuery.createUser(user).then((user) => {
    res.status(201).json(user);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Login a user
app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userQuery.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
        res.status(200).json({ message: 'Success login!', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user by ID
app.put('/users/:id', authenticatePassportJwt(), (req, res) => {
    const { id } = req.params;
    const user = req.body;
    userQuery.updateUser(id, user).then((updatedUser) => {
        res.status(200).json(updatedUser);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Delete user by ID
app.delete('/users/:id', authenticatePassportJwt(), (req, res) => {
    const { id } = req.params;
    userQuery.deleteUser(id).then(() => {
        res.status(204).send();
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Search users by name
app.get('/users/search', authenticatePassportJwt(), (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: "Name query parameter is required" });
    }
    userQuery.findByName(name).then((users) => {
        res.status(200).json(users);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

/**
 * Company Routes
 */

// Get all companies
app.get('/companies', authenticatePassportJwt(), (req, res) => {
    companyQuery.getCompanies().then((companies) => {
        res.status(200).json(companies);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Create a new company
const passport = require('passport');
app.use(initializePassport());
app.use(passport.initialize());

const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Adjust the destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
    }
});

const upload = multer({ storage: storage });

// Define fields that can be uploaded
const uploadFields = [
    { name: 'company_logo', maxCount: 1 },
    { name: 'npwp', maxCount: 1 },
    { name: 'siup_nib', maxCount: 1 },
    { name: 'nid_tdp', maxCount: 1 },
    { name: 'president_id', maxCount: 1 },
    { name: 'deed_of_incorporation', maxCount: 1 },
    { name: 'approval_from_minister', maxCount: 1 },
    { name: 'supporting_document', maxCount: 1 }
];

app.post('/companies', authenticatePassportJwt(), upload.fields(uploadFields), (req, res) => {
  console.log('Received Payload:', req.body);
  console.log('Files:', req.files);

  try {
      const userId = req.user._id; // Ensure req.user is set by passport
      const companyData = req.body;

      const preparedData = {
        user_id: userId,
        ...companyData,
        company_logo: req.files['company_logo'] ? req.files['company_logo'][0].path : null,
        npwp: req.files['npwp'] ? req.files['npwp'][0].path : null,
        siup_nib: req.files['siup_nib'] ? req.files['siup_nib'][0].path : null,
        nid_tdp: req.files['nid_tdp'] ? req.files['nid_tdp'][0].path : null,
        president_id: req.files['president_id'] ? req.files['president_id'][0].path : null,
        deed_of_incorporation: req.files['deed_of_incorporation'] ? req.files['deed_of_incorporation'][0].path : null,
        approval_from_minister: req.files['approval_from_minister'] ? req.files['approval_from_minister'][0].path : null,
        supporting_document: req.files['supporting_document'] ? req.files['supporting_document'][0].path : null
      };

      // Create and save the company using companyQuery
      const company = companyQuery.createCompany(preparedData);
      res.status(201).json(company);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.post('/test', upload.fields(uploadFields), (req, res) => {
  console.log('Received Payload:', req.body);
  console.log('Files:', req.files);
  res.send('Received');
});

// Get company by user ID
app.get('/companies/user/:userId', authenticatePassportJwt(), (req, res) => {
    const { userId } = req.params;
    companyQuery.getCompanyByUserId(userId).then((company) => {
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.status(200).json(company);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Update company by ID
app.put('/companies/:id', authenticatePassportJwt(), (req, res) => {
    const { id } = req.params;
    const company = req.body;
    companyQuery.updateCompany(id, company).then((updatedCompany) => {
        res.status(200).json(updatedCompany);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Delete company by ID
app.delete('/companies/:id', authenticatePassportJwt(), (req, res) => {
    const { id } = req.params;
    companyQuery.deleteCompany(id).then(() => {
        res.status(204).send();
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

/**
 * Error handling for 404 routes
 */
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

