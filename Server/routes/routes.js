const express = require('express');
const router = express.Router();
const { newAppointmentmail, completed, cancelled, rescheduled } = require('../middleware/middleware')

const { findAllDetails,
    findDetailsById,
    findAllCustomers,
    findAllDoctors,
    findAllReminders,
    findRemindersForBooking,
    rescheduleBooking,
    cancelBooking,
    updateNumberOfReminders,
    completeAppointment,
    newAppointment } = require('../controllers/controllers')




//gettig details from 
router.get('/api/booking', findAllDetails);//working

//getting boking details by id
router.get('/api/booking/:Id', findDetailsById);//working

//finding all customers
router.get('/api/users', findAllCustomers);//working

//finding all doctors
router.get('/api/doctors', findAllDoctors);//working

//finding all reminder 
router.get('/api/schedule', findAllReminders);//working

//finding reminder by id
router.get('/api/schedule/:Id', findRemindersForBooking);//working

//changing schedule
router.put('/api/reschedule/:Id', rescheduleBooking, rescheduled);//working

//cancelling booking 
router.delete('/api/cancel/:Id', cancelBooking, cancelled);//working

//update reminder sent when a reminder is succesfully sent
router.put('/api/schedule/:Id', updateNumberOfReminders);//working

//after apointmnet complete change appointmeents
router.put('/api/booking/:Id', completeAppointment, completed);//working

//creating new appointment
router.post('/api/booking', newAppointment, newAppointmentmail);//working




module.exports = { router };