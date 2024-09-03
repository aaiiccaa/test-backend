const mongoose = require('mongoose');
const uri = "mongodb+srv://aishafarizka:adidanai@cluster0.agdbm.mongodb.net/digistar";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectDB() {
    try{
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("MongoDB connected sucessfully");
    }catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

async function disconnectDB(){
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected successfully");
    } catch (error) {
        console.log("Error disconnecting from MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = {
    connectDB,
    disconnectDB
}