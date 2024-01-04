
const { BookingDetails, Reminder, DoctorsList } = require('../models/models');
const { v4: uuidv4 } = require('uuid');

//find all users
exports.findAllDetails = async (req, res) => {
    try {
        const usersinfo = await BookingDetails.find();
        //console.log(usersinfo);
        res.json(usersinfo);
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'An error occurred while fetching user.' });
    }
};

//find booking by booking id
exports.findDetailsById = async (req, res) => {
    const { bookingId } = req.params;
    try {
        const bookingDetails = await BookingDetails.findOne({
            'bookedServicesData.bookingId': bookingId,
        });
        if (!bookingDetails) {
            return res.status(404).json({ message: `Booking with ID ${bookingId} not found.` });
        }
        return res.status(200).json({ bookingDetails });
    } catch (error) {
        console.error('Error finding booking details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


//find all customers and there emails
exports.findAllCustomers = async (req, res) => {
    try {
        const customers = await BookingDetails.find({
            'bookedServicesData.customerEmail': { $exists: true },
        }, { 'bookedServicesData.customerName': 1, 'bookedServicesData.customerEmail': 1, _id: 0 });

        return res.status(200).json({ customers });
    } catch (error) {
        console.error('Error finding customers:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}



//find all doctors and there emails
exports.findAllDoctors = async (req, res) => {
    try {
        const doctors = await DoctorsList.find();
        //console.log(doctors)
        return res.status(200).json({ doctors });
    } catch (error) {
        console.error('Error finding doctors:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}




//find all reminders 
exports.findAllReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find();
        return res.status(200).json({ reminders });
    } catch (error) {
        console.error('Error finding reminders:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


//find reminder by id
exports.findRemindersForBooking = async (req, res) => {
    const { bookingId } = req.params; // Assuming the booking ID is part of the request parameters
    try {
        const remindersForBooking = await Reminder.find({ bookingId });

        if (!remindersForBooking || remindersForBooking.length === 0) {
            return res.status(404).json({ message: `No reminders found for booking with ID ${bookingId}.` });
        }
        return res.status(200).json({ remindersForBooking });
    } catch (error) {
        console.error('Error finding reminders for booking:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
//change booking time
exports.rescheduleBooking = async (req, res, next) => {
    const { bookingId } = req.params;
    const { selectedDateTime } = req.body;
    //console.log(req.body)

    try {
        // Update booking details
        const updatedBooking = await BookingDetails.findOneAndUpdate(
            { 'bookedServicesData.bookingId': bookingId },
            {
                $set: {
                    'bookedServicesData.$.meetingStartTime': selectedDateTime,
                    'bookedServicesData.$.isRescheduled': true,
                    // 'bookedServicesData.$.rescheduledBy': rescheduledBy,
                },
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: `Booking with ID ${bookingId} not found.` });
        }

        // Update reminder
        const updatedReminder = await Reminder.findOneAndUpdate(
            { bookingId },
            {
                $set: {
                    BookingTime: selectedDateTime,
                },
            },
            { new: true }
        );

        if (!updatedReminder) {
            return res.status(404).json({ message: `Booking with ID ${bookingId} not found.` });
        }

        req.rescheduledappointment = {
            todoc: updatedBooking.doctorEmail,
            tocon: updatedBooking.bookedServicesData[0].customerEmail,
            subject: 'Appointment Rescheduled',
            text: `Hi there this mail is to Appointment with Booking ID ${bookingId} has been rescheduled. The new meeting time is ${selectedDateTime}.`,
        };
        next();
    } catch (error) {
        console.error('Error rescheduling booking:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


//canceling booking
exports.cancelBooking = async (req, res, next) => {
    const { bookingId } = req.params;

    try {
        // Update booking details
        const updatedBooking = await BookingDetails.findOneAndUpdate(
            { 'bookedServicesData.bookingId': bookingId },
            {
                $set: {
                    'bookedServicesData.$.isCancelled': true,
                },
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: `Booking with ID ${bookingId} not found.` });
        }

        // Remove reminder
        const removedReminder = await Reminder.findOneAndDelete({ bookingId });

        if (!removedReminder) {
            return res.status(404).json({ message: `Booking with ID ${bookingId} not found.` });
        }

        req.cancelledappointment = {
            todoc: updatedBooking.doctorEmail,
            tocon: updatedBooking.bookedServicesData[0].customerEmail,
            subject: 'Booking Cancelled',
            text: `Hi there this mail is to inform that Appointment with Booking ID ${bookingId} has been cancelled.`,
        };
        next();
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



//update reminder sent number of time 
exports.updateNumberOfReminders = async (id) => {
    try {
        const currentTime = new Date();
        const presentTime = new Date(currentTime.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
        // Update reminder
        const result = await Reminder.findOneAndUpdate(
            { 'bookingId': id },
            {
                $inc: {
                    'numberOfReminders': 1,
                },
                $set: {
                    'isReminderSuccessful': true,
                    'lastReminderSentTime': presentTime, // Set lastReminderSentTime to the current time
                },
            }
        );
        //console.log(result);
        if (!result) {
            console.error(`Reminder for booking with ID ${id} not found.`);
        }
        else {
            console.log(`Reminder for booking with ID ${id} found and updated.`);
        }
    } catch (error) {
        console.error('Error updating number of reminders:', error);
    }
}



//sucess meeting
exports.completeAppointment = async (req, res, next) => {
    const { bookingId } = req.params;

    try {
        // Delete reminder
        const deletedReminder = await Reminder.findOneAndDelete({ bookingId });

        if (!deletedReminder) {
            return res.status(404).json({ message: `Reminder for booking with ID ${bookingId} not found.` });
        }

        // Update booking details
        const updatedBooking = await BookingDetails.findOneAndUpdate(
            { 'bookedServicesData.bookingId': bookingId },
            {
                $set: {
                    'bookedServicesData.$.transactionStatus': 'success',
                    'bookedServicesData.$.bookingStatus': 'success',
                    'bookedServicesData.$.meetingStartTime': 'success',
                    'bookedServicesData.$.meetingEndTime': 'success',
                },
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: `Booking with ID ${bookingId} not found.` });
        }

        req.completedappointment = {
            todoc: updatedBooking.doctorEmail,
            tocon: updatedBooking.bookedServicesData[0].customerEmail,
            subject: 'Completed Appointment',
            text: `Hi there this mail is to informyou that 
            Appointment with Booking ID ${bookingId} has been successfully completed.`,
        };
        next();
    } catch (error) {
        console.error('Error completing appointment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.newAppointment = async (req, res, next) => {
    try {

        const uuid1 = uuidv4();
        const uuid = uuid1.substring(0, 8);
        const bookingId = "B" + uuid;
        const orderId = "O" + uuid;
        const correlationId = "C" + uuid;
        const transactionId = "T" + uuid;
        const {
            accId,
            usernameDoctor,
            doctorEmail,
            doctorTimezone,
            customerEmail,
            customerPhoneNumber,
            customerName,
            serviceTitle,
            selectedDateTime,
            customerTimezone,
            location,
        } = req.body;


        // Create a new appointment object
        const newAppointmentData = {
            usernameDoctor,
            accId,
            doctorEmail,
            doctorTimezone,
            bookedServicesData: [{
                bookingId,
                orderId,
                customerEmail,
                customerPhoneNumber,
                customerName,
                serviceTitle,
                transactionId,
                datetime: selectedDateTime,
                customerTimezone,
                location,
                correlationId,
            }],
        };
        //console.log(req.newAppointmentData);

        const createdAppointment = await BookingDetails.create(newAppointmentData);

        // Create a reminder for the scheduled meeting
        const { bookingId: createdBookingId, customerEmail: createdCustomerEmail } = createdAppointment.bookedServicesData[0];

        const newReminderData = {
            bookingId: createdBookingId,
            BookingTime: selectedDateTime,
            doctorEmail,
            customerEmail: createdCustomerEmail,
            numberOfReminders: 0,
            lastReminderSentTime: null,
            isReminderSuccessful: false,
        };

        await Reminder.create(newReminderData);
        req.appointmentDataForEmail = {
            todoc: doctorEmail,
            tocon: createdCustomerEmail, // Replace with the recipient's email
            subject: 'Booked Appointment',
            text: `Hi there this is to inform that
            Appointment with Booking ID ${createdBookingId} has been successfully booked.`,
        };
        next();
    } catch (error) {
        console.error('Error creating new appointment and reminder:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getappointmentstime = async (time) => {
    try {
        const currentTime = new Date();
        const presentTime = new Date(currentTime.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
        const futureTime = new Date(currentTime.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000 + time * 60000); // Calculate future time

        // Fetch upcoming bookings from the database
        const upcomingBookings = await Reminder.find({
            'BookingTime': {
                $gte: presentTime,
                $lte: futureTime,
            },
        });

        //console.log(presentTime, futureTime);
        return upcomingBookings;
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        throw error;
    }
}