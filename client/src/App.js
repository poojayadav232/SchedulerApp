import { useEffect, useState } from "react";
import './App.css';

// import { SidebarData } from "./sidebar";
import { MdClose } from "react-icons/md"
import DatePicker from "react-datepicker";
import axios, { AxiosError } from "axios"
import "react-datepicker/dist/react-datepicker.css";
import { FaHome } from "react-icons/fa";
import { FaJediOrder } from "react-icons/fa";
import { PiUsersFourFill } from "react-icons/pi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdScheduleSend } from "react-icons/md";


axios.defaults.baseURL = "https://schedulerapp-ecgg.onrender.com";
//axios.defaults.baseURL = "http://localhost:8080";

function App() {

    //sections and there visibilities
    const [addsection, setAddSection] = useState(false);
    const [bookingsection, setBooking] = useState(false);
    const [doctorsection, setDoctor] = useState(false);
    const [customersection, setCustomer] = useState(false);
    const [remindersection, setReminder] = useState(false);
    const [remindsection, setRemind] = useState(false);
    const [viewsection, setviewSection] = useState(false);
    const [editsection, setEditSection] = useState(false);
    const [homesection, setHomeSection] = useState(true)

    //date
    const [selectedDateTime, setSelectedDateTime] = useState(null);


    //retrived data usestates
    const [dataList, setDataList] = useState([]);
    const [doctorsData, setDoctorsData] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [remindersData, setRemindersData] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [singledoctor, setDoctorData] = useState([])

    //submit and changing functions 
    const handlesubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('usernameDoctor', e.target.hiddenUsernameDoctor.value);
        formData.append('accId', e.target.hiddenAccId.value);
        formData.append('doctorEmail', e.target.hiddenDoctorEmail.value);
        formData.append('doctorTimezone', e.target.hiddenDoctorTimezone.value);


        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        //console.log(data);
        try {
            const response = await axios.post('/api/booking-details', data);
            console.log(response);
            alert(response.data.message);
            Getbookings();
            Getreminders();
            Getcustumers();

        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handlechange = async (e, id) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/reschedule/${id}`, {
                selectedDateTime: selectedDateTime,
            });
            alert(response.data.message)
        } catch (error) {
            console.error('Error:', error);
            alert('Error:', error);
        }
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
            const data = await axios.get('/api/customers');
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
            const data = await axios.get('/api/reminders');
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
            const data = await axios.get(`/api/booking-details/${id}`);
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
            const data = await axios.get('/api/booking-details');
            if (data.status === 200) {
                setDataList(data.data)
            }
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            // Handle the error (e.g., show a user-friendly message)
        }
    }

    const Success = async (bookingId) => {
        try {
            const response = await axios.put(`/api/booking-details/${bookingId}`);
            alert(response.data.message)
            closeviewclick()
        } catch (error) {
            if (error.response.status == 404)
                alert('Appointment already completed');
            closeviewclick()
        }
    };
    const Canceled = async (bookingId) => {
        try {
            const response = await axios.delete(`/api/cancel/${bookingId}`);
            alert(response.data.message)
            closeviewclick()
        } catch (error) {
            if (error.response.status == 404)
                alert('Appointment already completed');
            closeviewclick()
        }
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
        setHomeSection(false);
        setEditSection(false);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(true);
        setviewSection(false)
        setAddSection(false);
    }
    async function reschedule(id) {
        await Getbooking(id);
        setHomeSection(false)
        setAddSection(false);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(false);
        setEditSection(true);
    }
    async function addclick(id) {
        for (let i = 0; i < doctorsData.doctors.length; i++) {
            if (doctorsData.doctors[i].accId === id) {
                setDoctorData(doctorsData.doctors[i]);
            }
        }
        setHomeSection(false)
        setAddSection(true);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(false);
        setviewSection(false);
        setEditSection(false);
    }

    function bookingclick() {
        setHomeSection(false)
        setAddSection(false);
        setBooking(true);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(false);
        setviewSection(false);
        setEditSection(false);
    }
    function doctorclick() {
        setHomeSection(false)
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
        setHomeSection(false)
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
        setHomeSection(false)
        setAddSection(false);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(true);
        setRemind(false)
        setviewSection(false)
        setEditSection(false);
    }
    function closeviewclick() {
        setBooking(true);
        setReminder(false);
        setRemind(false);
        setHomeSection(false)
        Getbookings();
        Getreminders();
        Getcustumers();
    }
    function closeEditclick() {
        setEditSection(false);
        setBooking(true);
        Getbookings();
        Getreminders();
        Getcustumers();
    }
    function openhome() {
        setHomeSection(true);
        setEditSection(false);
        setBooking(false);
        setDoctor(false);
        setCustomer(false);
        setReminder(false);
        setRemind(false);
        setviewSection(false)
        setAddSection(false);
    }

    return (
        <>

            <div className='main'>

                <div className='header'>
                </div>
                <div className='centerpart'>
                    <div className='Sidebar'>
                        <ul className='sidebarlist'>
                            <li className='row'
                                onClick={() => openhome()}>
                                <div id="icon"><FaHome /></div>
                                <div id="title">Home</div>
                            </li>
                            <li className='row'
                                onClick={() => bookingclick()}>
                                <div id="icon"><FaJediOrder /></div>
                                <div id="title">AllBookings</div>
                            </li>
                            <li className='row'
                                onClick={() => doctorclick()}>
                                <div id="icon"><FaUserDoctor /></div>
                                <div id="title">AllDoctors</div>
                            </li>
                            <li className='row'
                                onClick={() => customerclick()}>
                                <div id="icon"><PiUsersFourFill /></div>
                                <div id="title">Patients</div>
                            </li>
                            <li className='row'
                                onClick={() => Reminderclick()}>
                                <div id="icon"><MdScheduleSend /></div>
                                <div id="title">Schedules</div>
                            </li>
                        </ul>
                    </div>
                    <div class="overlay"></div>
                    <div className='content'>
                        <div className="container">
                            {
                                homesection && (
                                    <div className="homesect">
                                        <div className="top">
                                            <img src="https://wallpapercave.com/wp/wp2968489.jpg" alt="Starting Image" />
                                            <div className="para">
                                                <h1>Welcome to Doctor Website</h1>
                                                <p>In this website we are listed specialist doctors you can choose a
                                                    doctor and add appointment. I also elisted booking data in bookins section.
                                                    when a appointment is booked doctor and patient receives a mail.
                                                    mails are also sent when appointment is Canceled , completed , or rescheduled.
                                                    we have one more feature that doctorsand patients will recieve mails
                                                    when appointmentis about 1 hr or 5 min as well.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text">
                                            <h2>Main Content Section</h2>
                                            <p>Your main content goes here in a div or any suitable container.</p>
                                        </div>
                                        <div className="image-container">
                                            <div className="imaging">
                                                <div>
                                                    <img src="https://static.vecteezy.com/system/resources/previews/005/307/230/non_2x/healthcare-and-medicine-concept-smart-medical-doctor-working-with-stethoscope-at-modern-hospital-free-photo.jpg" alt="Image 1" />
                                                    <p>Description for Image 1</p>
                                                </div>
                                                <div>
                                                    <img src="https://wallpapercave.com/wp/wp2968489.jpg" alt="Image 2" />
                                                    <p>Description for Image 2</p>
                                                </div>
                                            </div>
                                            <div className="imaging">
                                                <div>
                                                    <img src="https://static.vecteezy.com/system/resources/previews/005/307/230/non_2x/healthcare-and-medicine-concept-smart-medical-doctor-working-with-stethoscope-at-modern-hospital-free-photo.jpg" alt="Image 1" />
                                                    <p>Description for Image 1</p>
                                                </div>
                                                <div>
                                                    <img src="https://wallpapercave.com/wp/wp2968489.jpg" alt="Image 2" />
                                                    <p>Description for Image 2</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            {addsection && (
                                <div className="addcontainer">

                                    <form onSubmit={handlesubmit}>
                                        <div className="close-btn" onClick={() => setAddSection(false)}><MdClose /></div>
                                        <label htmlFor="usernameDoctor">Doctor Name:</label>
                                        <input type="text" id="usernameDoctor" value={singledoctor.usernameDoctor} name="usernameDoctor" disabled />

                                        <label htmlFor="accId">Doctor ID:</label>
                                        <input type="text" id="accId" value={singledoctor.accId} name="accId" disabled />

                                        <label htmlFor="doctorEmail">Doctor Email:</label>
                                        <input type="email" id="doctorEmail" value={singledoctor.doctorEmail} name="doctorEmail" disabled />

                                        <label htmlFor="doctorTimezone">Doctor Timezone:</label>
                                        <input type="text" id="doctorTimezone" value={singledoctor.doctorTimezone} name="doctorTimezone" disabled />
                                        <input type="hidden" id="hiddenUsernameDoctor" value={singledoctor.usernameDoctor} name="hiddenUsernameDoctor" />
                                        <input type="hidden" id="hiddenAccId" value={singledoctor.accId} name="hiddenAccId" />
                                        <input type="hidden" id="hiddenDoctorEmail" value={singledoctor.doctorEmail} name="hiddenDoctorEmail" />
                                        <input type="hidden" id="hiddenDoctorTimezone" value={singledoctor.doctorTimezone} name="hiddenDoctorTimezone" />

                                        <label htmlFor="customerEmail">Customer Email:</label>
                                        <input type="email" id="customerEmail" name="customerEmail" required />

                                        <label htmlFor="customerPhoneNumber">Customer Phone:</label>
                                        <input type="text" id="customerPhoneNumber" name="customerPhoneNumber" required />

                                        <label htmlFor="customerName">Customer Name:</label>
                                        <input type="text" id="customerName" name="customerName" required />

                                        <label htmlFor="serviceTitle">Service Title:</label>
                                        <input type="text" id="serviceTitle" name="serviceTitle" required />

                                        <div className="date-picker-container">
                                            <label htmlFor="selectedDateTime">Select Date and Time:</label>
                                            <DatePicker
                                                id="selectedDateTime"
                                                name="selectedDateTime"
                                                selected={selectedDateTime}
                                                onChange={(date) => {
                                                    const newDate = new Date(date.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
                                                    setSelectedDateTime(newDate)
                                                }}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                dateFormat="yyyy-MM-dd HH:mm:ss"
                                                minDate={new Date()}
                                                value={selectedDateTime ? selectedDateTime.toISOString() : ''}
                                            />
                                        </div>

                                        <label htmlFor="customerTimezone">Customer Timezone:</label>
                                        <input type="text" id="customerTimezone" name="customerTimezone" required />

                                        <label htmlFor="country">location:</label>
                                        <input type="text" id="location" name="location" required />

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
                                                <th>Bookings</th>
                                                <th>Stuatus</th>
                                                <th>Doctor Name</th>
                                                <th>Patient Name</th>
                                                <th>More</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataList.map((ele) => {
                                                return (
                                                    <tr>
                                                        <td>{ele.bookedServicesData[0].bookingId}</td>
                                                        <td>{ele.bookedServicesData[0].bookingStatus}</td>
                                                        <td>{ele.usernameDoctor}</td>
                                                        <td>{ele.bookedServicesData[0].customerName}</td>
                                                        <td><button className="btn" onClick={() => veiwclick(ele.bookedServicesData[0].bookingId)}>View More</button></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>)
                            }
                            {
                                doctorsection && (<div className="tableContainer">
                                    <div>
                                        <div className="cards">
                                            {doctorsData.doctors.map((ele) => {
                                                return (
                                                    <div className="card">
                                                        <div><img src={ele.doctorimage} /></div>
                                                        <div>{ele.accId}</div>
                                                        <div>{ele.usernameDoctor}</div>
                                                        <div>{ele.doctorEmail}</div>
                                                        <div>{ele.doctorTimezone}</div>
                                                        <div onClick={() => addclick(ele.accId)}><button className="btn">Book Appoinment</button></div>
                                                    </div>
                                                )
                                            })}
                                        </div >
                                    </div>
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
                                                <th>B.NO</th>
                                                <th>Booking Time</th>
                                                <th>Patient Email</th>
                                                <th>Doctor Email</th>
                                                <th>latest Reminder</th>
                                                <th>Number of Reminders</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {remindersData.map((ele) => {
                                                return (
                                                    <tr>
                                                        <td>{ele.bookingId}</td>
                                                        <td>{ele.BookingTime}</td>
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
                                                    <div>
                                                        <div className="btnnew" onClick={() => reschedule(bookingData.bookedServicesData[0].bookingId)}>Reschedule</div>
                                                        <div className="btnnew green" onClick={() => Success(bookingData.bookedServicesData[0].bookingId)}>complete</div>
                                                        <div className="btnnew red" onClick={() => Canceled(bookingData.bookedServicesData[0].bookingId)}>Cancel</div>
                                                    </div>
                                                    <div className="close-btn" onClick={() => closeviewclick()}><MdClose /></div>
                                                    <label htmlFor="bookingId">Booking ID:</label>
                                                    <input type="text" value={bookingData.bookedServicesData[0].bookingId} name="bookingId" disabled />

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
                                        <form onSubmit={(e) => handlechange(e, bookingData.bookedServicesData[0].bookingId)}>
                                            <div className="close-btn" onClick={() => closeEditclick()}><MdClose /></div>
                                            <label htmlFor="bookingId">Booking ID:</label>
                                            <input type="text" value={bookingData.bookedServicesData[0].bookingId} name="bookingId" disabled />

                                            <label htmlFor="orderId">Order ID:</label>
                                            <input type="text" value={bookingData.bookedServicesData[0].orderId} name="orderId" disabled />

                                            <label htmlFor="usernameDoctor">Doctor Name:</label>
                                            <input type="text" value={bookingData.usernameDoctor} name="usernameDoctor" disabled />

                                            <label htmlFor="accId">Doctor ID:</label>
                                            <input type="text" value={bookingData.accId} name="accId" disabled />

                                            <label htmlFor="doctorEmail">Doctor Email:</label>
                                            <input type="email" value={bookingData.doctorEmail} name="doctorEmail" disabled />

                                            <label htmlFor="customerEmail">Customer Email:</label>
                                            <input type="email" value={bookingData.bookedServicesData[0].customerEmail} name="customerEmail" disabled />

                                            <label htmlFor="customerPhoneNumber">Customer Phone:</label>
                                            <input type="text" value={bookingData.bookedServicesData[0].customerPhoneNumber} name="customerPhoneNumber" disabled />

                                            <label htmlFor="customerName">Customer Name:</label>
                                            <input type="text" value={bookingData.bookedServicesData[0].customerName} name="customerName" disabled />

                                            <label htmlFor="serviceTitle">Service Title:</label>
                                            <input type="text" value={bookingData.bookedServicesData[0].serviceTitle} name="serviceTitle" disabled />

                                            <div className="date-picker-container">
                                                <label htmlFor="selectedDateTime">Select Date and Time:</label>
                                                <DatePicker
                                                    id="selectedDateTime"
                                                    name="selectedDateTime"
                                                    selected={selectedDateTime}
                                                    onChange={(date) => {
                                                        const newDate = new Date(date.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
                                                        setSelectedDateTime(newDate)
                                                    }}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="yyyy-MM-dd HH:mm:ss"
                                                    minDate={new Date()}
                                                    value={selectedDateTime ? selectedDateTime.toISOString() : ''}
                                                />
                                            </div>

                                            <label htmlFor="location">location:</label>
                                            <input type="text" value={bookingData.bookedServicesData[0].location} name="location" disabled />

                                            <button className="btnnew">Confirm Change schedule</button>
                                        </form>
                                    </div>
                                )
                            }
                        </div >
                    </div>
                </div>
                <div className='footer'>
                    <p>&copy; 2023 Medical Scheduling Application. Project by poojitha .</p>
                </div>
            </div >
        </>
    );
}

export default App;