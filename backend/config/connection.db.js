const mongoose = require("mongoose");
require('dotenv').config();

console.log("MongoDB URI:", process.env.MONGODB_CONNECTION_URI); // Debugging line

const connectDB = async function () {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    console.log("Connection Successful!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
