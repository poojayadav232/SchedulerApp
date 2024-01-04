const cors = require('cors');
const { router } = require('./routes/routes')
const mongoose = require('mongoose');
require("dotenv").config();
const cron = require('node-cron');
const { getappointmentstime } = require('./controllers/controllers')
const { sendfiveminmail, sendonehrmail } = require('./middleware/middleware')
const { Reminder } = require('./models/models')
const express = require('express');
const app = express();

// Define your formDataParser middleware


//middleware
app.use(express.json())
app.use(cors());

app.use('/', router);

cron.schedule('* * * * *', async () => {
    try {
        const upcomingBookings = await getappointmentstime(60); // 60 minutes
        upcomingBookings.forEach((booking) => {
            const bookingTime = new Date(booking.BookingTime).getTime();
            const currentTime = new Date().getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
            const timeDifference = Math.floor((bookingTime - currentTime) / (1000 * 60)) + 1;
            console.log(timeDifference);
            if (timeDifference === 58) {
                sendonehrmail(booking);
            } else if (timeDifference === 5) {
                sendfiveminmail(booking)
            }
        });
    } catch (error) {
        console.error('Error in cron job:', error);
    }
}, { timezone: 'Asia/Kolkata' });



//mongoose connection
mongoose.connect(process.env.Mongodb_uri).then(() => {
    const port = process.env.port;
    app.listen(port, () => {
        console.log("server is running");
    });
});




