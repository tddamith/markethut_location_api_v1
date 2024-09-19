const dotEnv = require("dotenv");


// Load the default .env file
dotEnv.config();

// Dynamically load the environment-specific .env file if NODE_ENV is not "prod"
if (process.env.NODE_ENV && process.env.NODE_ENV !== "prod") {
  const configFile = `.env.${process.env.NODE_ENV}`; // Properly format the file path
  dotEnv.config({ path: configFile });
}

// Export the environment variables
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  OTP_EXPIRATION_TIME: process.env.OTP_EXPIRATION_TIME,
  SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY,
};
