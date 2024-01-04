const nodemailer = require('nodemailer');
const { updateNumberOfReminders } = require('../controllers/controllers')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mailschedule68@gmail.com',
        pass: 'wfen kxib jbjc blum',
    },
});

exports.newAppointmentmail = async (req, res) => {
    try {
        const { todoc, tocon, subject, text } = req.appointmentDataForEmail;
        const mailOptions = {
            from: 'mailschedule68@gmail.com',
            to: [tocon, todoc],
            subject: subject,
            text: text,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log('Email sent:', info.response);
        });
        res.json({ message: 'Added appointment and Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.completed = async (req, res) => {
    try {
        const { todoc, tocon, subject, text } = req.completedappointment;
        const mailOptions = {
            from: 'mailschedule68@gmail.com',
            to: [tocon, todoc],
            subject: subject,
            text: text,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log('Email sent:', info.response);
        });
        res.json({ message: 'completed appointment and Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.cancelled = async (req, res) => {
    try {
        const { todoc, tocon, subject, text } = req.cancelledappointment;
        const mailOptions = {
            from: 'mailschedule68@gmail.com',
            to: [tocon, todoc],
            subject: subject,
            text: text,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log('Email sent:', info.response);
        });
        res.json({ message: 'cancelled appointment and Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.rescheduled = async (req, res) => {
    try {
        const { todoc, tocon, subject, text } = req.rescheduledappointment;
        const mailOptions = {
            from: 'mailschedule68@gmail.com',
            to: [tocon, todoc],
            subject: subject,
            text: text,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log('Email sent:', info.response);
        });
        res.json({ message: 'Appointment rescheduled and Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.sendonehrmail = async (data) => {
    const { _id, bookingId, BookingTime, customerEmail, doctorEmail, numberOfReminders } = data;
    const presentTime = new Date(BookingTime.getTime() - 6 * 60 * 60 * 1000 + 30 * 60 * 1000);
    try {

        const { bookingId, BookingTime, customerEmail, doctorEmail, numberOfReminders } = data;
        const subject = 'Reminder mail for one hour before appoinment'
        const text = `Hello we This mail is regarding Appoinment for ${bookingId}:
                            There is one hour more left i.e: ${presentTime} before  your appoinment with doctor
                        Thank you `
        const mailOptions = {
            from: 'mailschedule68@gmail.com',
            to: [customerEmail, doctorEmail],
            subject: subject,
            text: text,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                //return res.status(500).json({ error: 'Internal Server Error' });
            }
            else {
                console.log('Email sent:', info.response);
                updateNumberOfReminders(bookingId);
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
    console.log("data", data);
}

exports.sendfiveminmail = async (data) => {
    const { _id, bookingId, BookingTime, customerEmail, doctorEmail, numberOfReminders } = data;
    const presentTime = new Date(BookingTime.getTime() - 6 * 60 * 60 * 1000 + 30 * 60 * 1000);
    try {
        const subject = 'Reminder mail for five min before appoinment'
        const text = `Hello we This mail is regarding Appoinment for ${bookingId}:
                            There is 5 minuties more left i.e: ${presentTime} before  your appoinment with doctor
                        Thank you `
        const mailOptions = {
            from: 'mailschedule68@gmail.com',
            to: [customerEmail, doctorEmail],
            subject: subject,
            text: text,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            }
            else {
                console.log('Email sent:', info.response);
                updateNumberOfReminders(bookingId);
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
    console.log("data2", data);
}