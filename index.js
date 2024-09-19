const express = require("express");
const dotenv = require("dotenv");
const {PORT} = require("./src/config");
const {databaseConnection} = require("./src/database");
const expressApp = require("./express-app");


const StartServer = async () => {
    dotenv.config();
    const app = express();
    await databaseConnection();
    await expressApp(app);
    app.listen(process.env.PORT, () => {
        console.log(`Listening to port ${process.env.PORT}`);
    })
    
        .on("error", (err) => {
            console.log(err);
            process.exit();
        });
};
StartServer();