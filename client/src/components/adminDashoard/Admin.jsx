import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
// import { format } from 'date-fns';
import './admin.css';
import axios from "axios";

const Admin = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateArrivalCount, setLateArrivalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user count
        const responseCount = await fetch("http://localhost:4000/api/user/countUsers");
        const dataCount = await responseCount.json();

        if (typeof dataCount === "number") {
          setTotalEmployees(dataCount);
        } else {
          console.error("Invalid user count data format. Expected a number:", dataCount);
        }

        // Fetch counters
        // const responseCounters = await fetch("http://localhost:4000/api/admin/storeAttendanceCounts");
        // const dataCounters = await responseCounters.json();

        // if (dataCounters) {
        //   setOnTimeCount(dataCounters.onTimeCount);
        //   setAbsentCount(dataCounters.absentCount);
        //   setLateArrivalCount(dataCounters.lateArrivalCount);
        // } else {
        //   console.error("Invalid counters data format:", dataCounters);
        // }

        // Fetch all users
        const responseUsers = await fetch("http://localhost:4000/api/admin/getAllUsers");
        const dataUsers = await responseUsers.json();
        console.log(dataUsers)

        if (Array.isArray(dataUsers)) {
          setUsers(dataUsers);
        } else {
          console.error("Invalid users data format. Expected an array:", dataUsers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    fetchData();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatHoursAndMinutesToString = (totalMinutes) => {
    const hours = Math.ceil(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (hours === 1) {
      return `${hours} hour${minutes !== 0 ? ` and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
    } else {
      return `${hours} hours${minutes !== 0 ? ` and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
    }
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDay = daysOfWeek[currentDateTime.getDay()];
  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const convertHoursStringToDecimal = (hoursString) => {
    if (typeof hoursString !== 'string') {
      return 0; 
    }

    const match = hoursString.match(/^(\d+(\.\d+)?)\s*hour(s)?(\s+(\d+)\s*minute(s)?)?/);

    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = match[5] ? parseInt(match[5]) : 0;

      if (!isNaN(hours) && !isNaN(minutes)) {
        const totalMinutes = hours * 60 + minutes;
        return Math.round(totalMinutes); 
      }
    }

    return 0; 
  };

  return (
    <div className="adminDashboard">
      <div className="container">
        <header>
          <p>Time tracker</p>
          <div className="right-icons">
            <img src="/assets/icons8-add-user-50.png" alt="" />
            <img src="/assets/notification-bing.png" alt="" />
            <img src="/assets/Ellipse 940.png" alt="" />
          </div>
        </header>

        <p className="dash">Dashboard</p>

        <div className="main-counter">
          <div className="calender">
            <div className="current-time">
              <img src="/assets/Vector (7).png" alt="" />
              <p className="time">{formattedTime}</p>
            </div>
            <p className="current-day">{currentDay}</p>
            <p className="current-date">{formattedDate}</p>
          </div>
          <div className="counters">
            <div className="total-employees">
              <p className="total-number">{totalEmployees}</p>
              <p className="total-head">Total employees present</p>
            </div>
            <div className="total-employees">
              <p className="total-number">{onTimeCount}</p>
              <p className="total-head">On time</p>
            </div>
            <div className="total-employees">
              <p className="total-number">{absentCount}</p>
              <p className="total-head">Absent</p>
            </div>
            <div className="total-employees">
              <p className="total-number">{lateArrivalCount}</p>
              <p className="total-head">Late Arrivals</p>
            </div>
          </div>
        </div>

        <div className="attendance-overview">
          <div className="attendance-header">
            <p className="attendance-head">Attendance overview</p>
            <div className="search-container">
              <CiSearch className="search-icon" />
              <input type="text" placeholder="Search" />
            </div>
            <div className="filter-calender">
              <img src="/assets/calendar-search.png" alt="" />
              <p className="filter-date">29Jun 2023</p>
            </div>
          </div>
          <div className="attendance-table">
            <table>
              <thead>
                <tr>
                  <td>Id</td>
                  <td>First Name</td>
                  <td>Last Name</td>
                  <td>Date</td>
                  <td>Check In</td>
                  <td>Check Out</td>
                  <td>Work Hours</td>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <React.Fragment key={user._id}>
                    { user.checkInsAndOuts?.length > 0 ? (
                      user.checkInsAndOuts.map((checkInOut, index) => (
                        <tr key={`${user._id}_${index}`}>
                          <td>{user._id}</td>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{new Date(checkInOut.date).toLocaleDateString()}</td>
                          <td>{new Date(checkInOut.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                          <td>{new Date(checkInOut.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                          <td>{formatHoursAndMinutesToString(convertHoursStringToDecimal(checkInOut.totalHours))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td colSpan="4">No check-ins and check-outs available for this user</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
