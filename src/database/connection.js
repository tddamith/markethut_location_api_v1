const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Ensure DB_URL is set
if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not defined.");
  process.exit(1); // Exit the process if the environment variable is not set
}

const connectToDatabase = async () => {
  try {
    console.log("Connecting to the database...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,  // 10 seconds
      socketTimeoutMS: 45000,   // 45 seconds
    });
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    // Ensure graceful shutdown
    mongoose.connection.close(() => {
      console.log("Mongoose connection closed due to application error");
      process.exit(1); // Exit the process if unable to connect to the database
    });
  }
};

module.exports = connectToDatabase;
