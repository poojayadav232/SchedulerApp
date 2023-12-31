import { useEffect, useState } from "react";
import './App.css';
import { MdClose } from "react-icons/md"
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


axios.defaults.baseURL = "https://schedulerapp-ecgg.onrender.com";
//axios.defaults.baseURL = "http://localhost:8080";

function App() {

    //sections and there visibilities
    const [addsection, setAddSection] = useState(false);
    const [bookingsection, setBooking] = useState(true);
    const [doctorsection, setDoctor] = useState(false);
    const [customersection, setCustomer] = useState(false);
    const [remindersection, setReminder] = useState(false);
    const [remindsection, setRemind] = useState(false);
    const [viewsection, setviewSection] = useState(false);
    const [editsection, setEditSection] = useState(false);

    //date
    const [selectedDateTime, setSelectedDateTime] = useState(null);


    //retrived data usestates
    const [dataList, setDataList] = useState([]);
    const [doctorsData, setDoctorsData] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [remindersData, setRemindersData] = useState([]);
    const [bookingData, setBookingData] = useState([]);

    //submit and changing functions 
    const handlesubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await axios.post('/api/booking', data);
            alert(response.data.message)
        } catch (error) {
            console.error('Error:', error);
        }
        Getbookings();
        Getreminders();
        Getdoctors();
        Getcustumers();
    };



    const handleDateChange = (date) => {
        try {
            if (date instanceof Date && !isNaN(date)) {
                setSelectedDateTime(date);
            } else {
                console.error('Invalid date:', date);
            }
        } catch (error) {
            console.error('Error handling date change:', error);
        }
    };

    const handlechange = async (e, id) => {
        e.preventDefault();

        try {
            const response = await axios.put(`/api/reschedule/${id}`, {
                selectedDateTime: selectedDateTime.toISOString(),
            });
            alert(response.data.message)
        } catch (error) {
            console.error('Error:', error);
            alert('Error:', error);
        }
        Getbookings();
        Getreminders();
    };

    //functions to be called for fetching data in
    const Getdoctors = async () => {
        try {
            const data = await axios.get('/api/doctors');
            if (data.status === 200) {
                setDoctorsData(data.data);
            }
        }
        catch (error) {
            console.error('Error fetching doctors:', error);
        }
    }
    const Getcustumers = async () => {
        try {
            const data = await axios.get('/api/users');
            if (data.status === 200) {
                const datanew = [];
                data.data.customers.forEach((ele) => {
                    datanew.push(ele.bookedServicesData[0])
                });
                setCustomersData(datanew);
            }
        }
        catch (error) {
            console.error('Error fetching customers:', error);
        }
    }
    const Getreminders = async () => {
        try {
            const data = await axios.get('/api/schedule');
            if (data.status === 200) {
                setRemindersData(data.data.reminders);
            }
        }
        catch (error) {
            console.error('Error fetching reminders:', error);
        }
    }

    const Getbooking = async (id) => {
        try {
            const data = await axios.get(`/api/booking/${id}`);
            if (data.status === 200) {
                setBookingData(data.data.bookingDetails);
            }
        }
        catch (error) {
            console.error('Error fetching booking:', error);
        }
    }
    const Getbookings = async () => {
        try {
            const data = await axios.get('/api/booking');
            if (data.status === 200) {
                setDataList(data.data)
            }
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            // Handle the error (e.g., show a user-friendly message)
        }
    }

    const Success = async (Id) => {
        try {
            const response = await axios.put(`/api/booking/${Id}`);
            alert(response.data.message)
        } catch (error) {
            console.error('Error:', error);
        }
        Getbookings();
        Getreminders();
        Getdoctors();
        Getcustumers();
    };
    const Canceled = async (Id) => {
        try {
            const response = await axios.delete(`/api/cancel/${Id}`);
            alert(response.data.message)
        } catch (error) {
            console.error('Error:', error);
        }
        Getbookings();
        Getreminders();
        Getdoctors();
        Getcustumers();
    };


    //useeffect for getting details
    useEffect(() => {
        Getbookings();
        Getreminders();
        Getdoctors();
        Getcustumers();
    }, [])


    //handling  hidding buttons onclick
    async function veiwclick(id) {
        await Getbooking(id);
        setAddSection(false);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(true);
        setEditSection(false);
    }
    async function reschedule(id) {
        await Getbooking(id);
        setAddSection(false);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(false);
        setEditSection(true);
    }
    function addclick() {
        setAddSection(true);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(false);
        setviewSection(false)
        setEditSection(false);
    }

    function bookingclick() {
        setAddSection(false);
        setBooking(true);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(false)
        setviewSection(false)
        setEditSection(false);
    }
    function doctorclick() {
        setAddSection(false);
        setBooking(false);
        setDoctor(true);
        setCustomer(false);
        setReminder(false);
        setRemind(false)
        setviewSection(false)
        setEditSection(false);
    }
    function customerclick() {
        setAddSection(false);
        setBooking(false);
        setDoctor(false);
        setCustomer(true);
        setReminder(false);
        setRemind(false)
        setviewSection(false)
        setEditSection(false);
    }
    function Reminderclick() {
        setAddSection(false);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(true);
        setRemind(false)
        setviewSection(false)
        setEditSection(false);
    }


    return (
        <>
            <div className="container">
                <div className="section-heading">About Section</div>
                <ul className="nav-list">
                    <li className="nav-item">
                        <button className="btn btn-add" onClick={() => addclick()}>ADD</button>
                    </li>
                    <li className="nav-item">
                        <button className="btn" onClick={() => bookingclick()}>Booking details</button>
                    </li>
                    <li className="nav-item">
                        <button className="btn" onClick={() => doctorclick()}>Doctors details</button>
                    </li>
                    <li className="nav-item">
                        <button className="btn" onClick={() => customerclick()}>Customers details</button>
                    </li>
                    <li className="nav-item">
                        <button className="btn" onClick={() => Reminderclick()}>Reminders</button>
                    </li>
                </ul>

                {addsection && (
                    <div className="addcontainer">

                        <form onSubmit={handlesubmit}>
                            <div className="close-btn" onClick={() => setAddSection(false)}><MdClose /></div>
                            <label htmlFor="usernameDoctor">Doctor Name:</label>
                            <input type="text" id="usernameDoctor" name="usernameDoctor" required />

                            <label htmlFor="accId">Doctor ID:</label>
                            <input type="text" id="accId" name="accId" required />

                            <label htmlFor="doctorEmail">Doctor Email:</label>
                            <input type="email" id="doctorEmail" name="doctorEmail" required />

                            <label htmlFor="doctorTimezone">Doctor Timezone:</label>
                            <input type="text" id="doctorTimezone" name="doctorTimezone" required />

                            <label htmlFor="Id">Booking ID:</label>
                            <input type="text" id="Id" name="Id" required />

                            <label htmlFor="orderId">Order ID:</label>
                            <input type="text" id="orderId" name="orderId" required />

                            <label htmlFor="customerEmail">Customer Email:</label>
                            <input type="email" id="customerEmail" name="customerEmail" required />

                            <label htmlFor="customerPhoneNumber">Customer Phone:</label>
                            <input type="text" id="customerPhoneNumber" name="customerPhoneNumber" required />

                            <label htmlFor="customerName">Customer Name:</label>
                            <input type="text" id="customerName" name="customerName" required />

                            <label htmlFor="serviceTitle">Service Title:</label>
                            <input type="text" id="serviceTitle" name="serviceTitle" required />

                            <label htmlFor="transactionId">Transaction ID:</label>
                            <input type="text" id="transactionId" name="transactionId" required />

                            <div className="date-picker-container">
                                <label htmlFor="selectedDateTime">Select Date and Time:</label>
                                <DatePicker
                                    id="selectedDateTime"
                                    name="selectedDateTime"
                                    selected={selectedDateTime}
                                    onChange={(date) => setSelectedDateTime(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm:ss"
                                    minDate={new Date()}
                                />
                            </div>

                            <label htmlFor="customerTimezone">Customer Timezone:</label>
                            <input type="text" id="customerTimezone" name="customerTimezone" required />

                            <label htmlFor="country">location:</label>
                            <input type="text" id="location" name="location" required />

                            <label htmlFor="correlationId">Correlation ID:</label>
                            <input type="text" id="correlationId" name="correlationId" required />

                            <button className="btn">Add Appointment</button>
                        </form>
                    </div>
                )
                }
                {
                    bookingsection && (<div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>booking status</th>
                                    <th>Doctor name</th>
                                    <th>customer Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataList.map((ele) => {
                                    return (
                                        <tr>
                                            <td>{ele.bookedServicesData[0].Id}</td>
                                            <td>{ele.bookedServicesData[0].bookingStatus}</td>
                                            <td>{ele.usernameDoctor}</td>
                                            <td>{ele.bookedServicesData[0].customerName}</td>
                                            <td><button className="btn" onClick={() => veiwclick(ele.bookedServicesData[0].Id)}>More Details</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>)
                }
                {
                    doctorsection && (<div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>Doctor Name</th>
                                    <th>Doctor Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctorsData.doctors.map((ele) => {
                                    return (
                                        <tr>
                                            <td>{ele.usernameDoctor}</td>
                                            <td>{ele.doctorEmail}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>)
                }
                {
                    customersection && (<div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Customer Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customersData.map((ele) => {
                                    return (
                                        <tr>
                                            <td>{ele.customerName}</td>
                                            <td>{ele.customerEmail}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>)
                }
                {
                    remindersection && (<div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>BookingId</th>
                                    <th>BookingTime</th>
                                    <th>CustomerEmail</th>
                                    <th>DoctorEmail</th>
                                    <th>latest Reminder</th>
                                    <th>Number of Reminders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {remindersData.map((ele) => {
                                    return (
                                        <tr>
                                            <td>{ele.BookingTime}</td>
                                            <td>{ele.Id}</td>
                                            <td>{ele.customerEmail}</td>
                                            <td>{ele.doctorEmail}</td>
                                            <td>{ele.lastReminderSentTime}</td>
                                            <td>{ele.numberOfReminders}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>)
                }
                {
                    remindsection && (
                        <>
                            {(
                                <div className="addcontainer" >
                                    <form>
                                        <label htmlFor="Id">Booking ID:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].Id} name="Id" disabled />

                                        <label htmlFor="orderId">Order ID:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].orderId} name="orderId" disabled />

                                        <label htmlFor="usernameDoctor">Doctor Name:</label>
                                        <input type="text" value={bookingData.usernameDoctor} name="usernameDoctor" disabled />

                                        <label htmlFor="accId">Doctor ID:</label>
                                        <input type="text" value={bookingData.accId} name="accId" disabled />

                                        <label htmlFor="doctorEmail">Doctor Email:</label>
                                        <input type="email" value={bookingData.doctorEmail} name="doctorEmail" disabled />

                                        <label htmlFor="doctorTimezone">Doctor Timezone:</label>
                                        <input type="text" value={bookingData.doctorTimezone} name="doctorTimezone" disabled />

                                        <label htmlFor="customerEmail">Customer Email:</label>
                                        <input type="email" value={bookingData.bookedServicesData[0].customerEmail} name="customerEmail" disabled />

                                        <label htmlFor="customerPhoneNumber">Customer Phone:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].customerPhoneNumber} name="customerPhoneNumber" disabled />

                                        <label htmlFor="customerName">Customer Name:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].customerName} name="customerName" disabled />

                                        <label htmlFor="serviceTitle">Service Title:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].serviceTitle} name="serviceTitle" disabled />

                                        <label htmlFor="transactionId">Transaction ID:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].transactionId} name="transactionId" disabled />

                                        <label htmlFor="dateTime">Date and Time:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].datetime} name="dateTime" disabled />

                                        <label htmlFor="customerTimezone">Customer Timezone:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].customerTimezone} name="customerTimezone" disabled />

                                        <label htmlFor="location">location:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].location} name="location" disabled />

                                        <label htmlFor="transactionStatus">Transaction Status:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].transactionStatus} name="transactionStatus" disabled />

                                        <label htmlFor="bookingStatus">Booking Status:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].bookingStatus} name="bookingStatus" disabled />

                                        <label htmlFor="meetingStartTime">Meeting Start:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].meetingStartTime} name="meetingStartTime" disabled />

                                        <label htmlFor="meetingEndTime">Meeting EndTime:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].meetingEndTime} name="meetingEndTime" disabled />

                                        <label htmlFor="correlationId">Correlation ID:</label>
                                        <input type="text" value={bookingData.bookedServicesData[0].correlationId} name="correlationId" disabled />

                                        <div className="btn" onClick={() => reschedule(bookingData.bookedServicesData[0].Id)}>Reschedule</div>
                                        <div className="btn" onClick={() => Success(bookingData.bookedServicesData[0].Id)}>success</div>
                                        <div className="btn" onClick={() => Canceled(bookingData.bookedServicesData[0].Id)}>Cancel</div>
                                    </form>
                                </div>
                            )
                            }
                        </>
                    )
                }
                {
                    editsection && (
                        <div className="addcontainer">
                            <form onSubmit={(e) => handlechange(e, bookingData.bookedServicesData[0].Id)}>

                                <div className="date-picker-container">
                                    <label htmlFor="selectedDateTime">Select Date and Time:</label>
                                    <DatePicker
                                        id="selectedDateTime"
                                        name="selectedDateTime"
                                        selected={selectedDateTime}
                                        onChange={handleDateChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="yyyy-MM-dd HH:mm:ss"
                                        minDate={new Date()}
                                    />
                                </div>

                                <button className="btn">change schedule</button>
                            </form>
                        </div>
                    )
                }
            </div >
        </>
    );
}

export default App;
