const mongoose = require('mongoose');
const schema = require('./schema');
const bcrypt = require('bcrypt');

const Users = mongoose.model('User', schema.userSchema);
const Companies = mongoose.model('Company', schema.companySchema);

// Get all users
async function getUsers() {
    return Users.find();
}

// Get user by email
async function getUserByEmail(email) {
    return Users.findOne({ email }).populate('company_id');
}

// Create a new user
async function createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const newUser = new Users(userData);
    return newUser.save();
}

// Update user by ID
async function updateUser(userId, updateData) {
    if (updateData.password) {
        const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
        updateData.password = hashedPassword;
    }
    return Users.findByIdAndUpdate(userId, updateData, { new: true });
}

// Delete user by ID
async function deleteUser(userId) {
    return Users.findByIdAndDelete(userId);
}

async function findOneByEmail(email) {
    return Users.findOne({ email });
}

// Get all companies
async function getCompanies() {
    return Companies.find();
}

// Get company by user ID
async function getCompanyByUserId(userId) {
    return Companies.findOne({ user_id: userId });
}

// Create a new company
async function createCompany(companyData) {
    const newCompany = new Companies(companyData);
    return newCompany.save();
}

// Update company by ID
async function updateCompany(companyId, updateData) {
    return Companies.findByIdAndUpdate(companyId, updateData, { new: true });
}

// Delete company by ID
async function deleteCompany(companyId) {
    return Companies.findByIdAndDelete(companyId);
}

module.exports = {
    getUsers,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    findOneByEmail,
    getCompanies,
    getCompanyByUserId,
    createCompany,
    updateCompany,
    deleteCompany
};
