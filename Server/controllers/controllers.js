
const { BookingDetails, Reminder } = require('../models/models');

//find all users
exports.findAllDetails = async (req, res) => {
    try {
        const usersinfo = await BookingDetails.find();
        res.json(usersinfo);
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'An error occurred while fetching user.' });
    }
};

//find booking by booking id
exports.findDetailsById = async (req, res) => {
    const { Id } = req.params;
    try {
        const bookingDetails = await BookingDetails.findOne({
            'bookedServicesData.Id': Id,
        });
        if (!bookingDetails) {
            return res.status(404).json({ message: `Booking with ID ${Id} not found.` });
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
        const doctors = await BookingDetails.find(
            { 'doctorEmail': { $exists: true } },
            { 'usernameDoctor': true, 'doctorEmail': true, _id: 0 }
        );
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
    const { Id } = req.params;
    try {
        const remindersForBooking = await Reminder.find({ Id });

        if (!remindersForBooking || remindersForBooking.length === 0) {
            return res.status(404).json({ message: `No reminders found for booking with ID ${Id}.` });
        }
        return res.status(200).json({ remindersForBooking });
    } catch (error) {
        console.error('Error finding reminders for booking:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
//change booking time
exports.rescheduleBooking = async (req, res, next) => {
    const { Id } = req.params;
    const { selectedDateTime } = req.body;
    try {
        // Update booking details
        const updatedBooking = await BookingDetails.findOneAndUpdate(
            { 'bookedServicesData.Id': Id },
            {
                $set: {
                    'bookedServicesData.$.meetingStartTime': selectedDateTime,
                    'bookedServicesData.$.isRescheduled': true,
                },
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: `Booking with ID ${Id} not found.` });
        }

        // Update reminder
        const updatedReminder = await Reminder.findOneAndUpdate(
            { Id },
            {
                $set: {
                    BookingTime: selectedDateTime,
                },
            },
            { new: true }
        );

        if (!updatedReminder) {
            return res.status(404).json({ message: `Booking with ID ${Id} not found.` });
        }

        req.rescheduledappointment = {
            todoc: updatedBooking.doctorEmail,
            tocon: updatedBooking.bookedServicesData[0].customerEmail,
            subject: 'Appointment Rescheduled',
            text: `Appointment with Booking ID ${Id} has been rescheduled. The new meeting time is ${selectedDateTime}.`,
        };
        next();
    } catch (error) {
        console.error('Error rescheduling booking:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


//canceling booking
exports.cancelBooking = async (req, res, next) => {
    const { Id } = req.params;

    try {
        // Update booking details
        const updatedBooking = await BookingDetails.findOneAndUpdate(
            { 'bookedServicesData.Id': Id },
            {
                $set: {
                    'bookedServicesData.$.isCancelled': true,
                },
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: `Booking with ID ${Id} not found.` });
        }

        // Remove reminder
        const removedReminder = await Reminder.findOneAndDelete({ Id });

        if (!removedReminder) {
            return res.status(404).json({ message: `Booking with ID ${Id} not found.` });
        }

        req.cancelledappointment = {
            todoc: updatedBooking.doctorEmail,
            tocon: updatedBooking.bookedServicesData[0].customerEmail,
            subject: 'Booking Cancelled',
            text: `Appointment with Booking ID ${Id} has been cancelled.`,
        };
        next();
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



//update reminder sent number of time 
exports.updateNumberOfReminders = async (req, res) => {
    const { Id } = req.params;

    try {
        // Update reminder
        const updatedReminder = await Reminder.findOneAndUpdate(
            { Id },
            {
                $inc: {
                    numberOfReminders: 1,
                },
            },
            { new: true }
        );

        if (!updatedReminder) {
            return res.status(404).json({ message: `Reminder for booking with ID ${Id} not found.` });
        }

        return res.status(200).json({ updatedReminder });
    } catch (error) {
        console.error('Error updating number of reminders:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


//sucess meeting
exports.completeAppointment = async (req, res, next) => {
    const { Id } = req.params;

    try {
        // Delete reminder
        const deletedReminder = await Reminder.findOneAndDelete({ Id });

        if (!deletedReminder) {
            return res.status(404).json({ message: `Reminder for booking with ID ${Id} not found.` });
        }

        const updatedBooking = await BookingDetails.findOneAndUpdate(
            { 'bookedServicesData.Id': Id },
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
            return res.status(404).json({ message: `Booking with ID ${Id} not found.` });
        }

        req.completedappointment = {
            todoc: updatedBooking.doctorEmail,
            tocon: updatedBooking.bookedServicesData[0].customerEmail,
            subject: 'Sucessfully completed appointment',
            text: `Appointment with Booking ID ${Id} has been successfully completed.`,
        };
        next();
    } catch (error) {
        console.error('Error completing appointment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.newAppointment = async (req, res, next) => {
    try {
        const {
            usernameDoctor,
            accId,
            doctorEmail,
            doctorTimezone,
            Id,
            orderId,
            customerEmail,
            customerPhoneNumber,
            customerName,
            serviceTitle,
            transactionId,
            selectedDateTime,
            customerTimezone,
            location,
            correlationId,
        } = req.body;


        // Create a new appointment object
        const newAppointmentData = {
            usernameDoctor,
            accId,
            doctorEmail,
            doctorTimezone,
            bookedServicesData: [{
                Id,
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
        //console.log(req.parsedFormData);

        const createdAppointment = await BookingDetails.create(newAppointmentData);

        // Create a reminder for the scheduled meeting
        const { Id: createdBookingId, customerEmail: createdCustomerEmail } = createdAppointment.bookedServicesData[0];

        const newReminderData = {
            Id: createdBookingId,
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
            tocon: createdCustomerEmail,
            subject: 'Sucessfully booked appointment',
            text: `Appointment with Booking ID ${createdBookingId} has been successfully booked.`,
        };
        next();
    } catch (error) {
        console.error('Error creating new appointment and reminder:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
