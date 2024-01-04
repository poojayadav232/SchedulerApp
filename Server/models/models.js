const mongoose = require('mongoose');

const bookingDetailsSchema = new mongoose.Schema({
    usernameDoctor: String,
    accId: String,
    doctorEmail: String,
    doctorTimezone: String,
    bookedServicesData: [{
        bookingId: String,
        orderId: String,
        customerEmail: String,
        customerPhoneNumber: String,
        customerName: String,
        serviceTitle: String,
        transactionId: String,
        isRescheduled: { type: Boolean, default: false },
        isCancelled: { type: Boolean, default: false },
        numberOfReschedules: { type: Number, default: 0 },
        rescheduledBy: { type: String, default: null },
        transactionStatus: { type: String, default: 'pending' },
        bookingStatus: { type: String, default: 'pending' },
        meetingStartTime: { type: String, default: 'pending' },
        meetingEndTime: { type: String, default: 'pending' },
        datetime: Date,
        customerTimezone: String,
        location: String,
        correlationId: String
    }]
});

const reminderSchema = new mongoose.Schema({
    bookingId: String,
    BookingTime: Date,
    doctorEmail: String,
    customerEmail: String,
    numberOfReminders: Number,
    lastReminderSentTime: Date,
    isReminderSuccessful: Boolean,
});


const DoctorsSchema = new mongoose.Schema({
    usernameDoctor: String,
    accId: String,
    doctorEmail: String,
    doctorTimezone: String
});

const DoctorsList = mongoose.model('DoctorsList', DoctorsSchema);
const BookingDetails = mongoose.model('BookingDetails', bookingDetailsSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = {
    BookingDetails,
    Reminder,
    DoctorsList
}
