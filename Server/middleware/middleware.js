const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mailingtesting79@gmail.com',
        pass: 'gcuh yxlm esvk kjeu',
    },
});

exports.newAppointmentmail = async (req, res) => {
    try {
        const { todoc, tocon, subject, text } = req.appointmentDataForEmail;
        const mailOptions = {
            from: 'mailingtesting79@gmail.com',
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
            from: 'mailingtesting79@gmail.com',
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
            from: 'mailingtesting79@gmail.com',
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
            from: 'mailingtesting79@gmail.com',
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