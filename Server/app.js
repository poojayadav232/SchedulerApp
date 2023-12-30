const cors = require('cors');
const { router } = require('./routes/routes')
const mongoose = require('mongoose');
require("dotenv").config();

const express = require('express');
const app = express();

// Define your formDataParser middleware


//middleware
app.use(express.json())
app.use(cors());

app.use('/', router);

//mongoose connection
mongoose.connect(process.env.Mongodb_uri).then(() => {
    const port = process.env.port;
    app.listen(port, () => {
        console.log("server is running");
    });
});




