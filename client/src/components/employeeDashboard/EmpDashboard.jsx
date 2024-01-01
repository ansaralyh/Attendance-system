import React, { useState, useEffect } from "react";
import axios from "axios";
import "./emp.css";

import "bootstrap/dist/css/bootstrap.css";




  
  const EmpDashboard = ({ user }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [currentDay, setCurrentDay] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const [formattedTime, setFormattedTime] = useState("");
    const [checkInRecord, setCheckInRecord] = useState();
  
    useEffect(() => {
      const updateDateTime = () => {
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        setCurrentDay(daysOfWeek[currentDateTime.getDay()]);
        setFormattedDate(currentDateTime.toLocaleDateString());
        setFormattedTime(
          currentDateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      };
  
      const intervalId = setInterval(() => {
        setCurrentDateTime(new Date());
        updateDateTime();
      }, 1000);
  
    
      return () => clearInterval(intervalId);
    }, [currentDateTime]);
  
    const handleCheckIn = async () => {
      try {
        const userId = user.id; 
        const response = await axios.post(
          `http://localhost:4000/api/user/checkIn/${userId}`
        );
        console.log(response.data); 
        setCheckInRecord(response.data.checkInRecord);
      } catch (error) {
        console.error("Check-in failed:", error);
      }
    };
  
    const handleCheckOut = async () => {
      try {
        const userId = user.id; 
        const response = await axios.post(
          `http://localhost:4000/api/user/checkOut/${userId}`
        );
        console.log(response.data); // handle response as needed
        setCheckInRecord(null);
      } catch (error) {
        console.error("Check-out failed:", error);
      }
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

        <div className="main-counter1">
          <div className="calender">
            <div className="current-time">
              <img src="/assets/Vector (7).png" alt="" />
              <p className="time">{formattedTime}</p>
            </div>
            <p className="current-day">{currentDay}</p>
            <p className="current-date">{formattedDate}</p>
          </div>
          <div className="checkInOut">
            <button>Check in</button>
            <button>Check out</button>
          </div>
        </div>

        <div className="attendance-overview">
          <div className="attendance-header">
            <p className="attendance-head">Attendance overview</p>
            <div className="search-container">
              {/* <CiSearch className="search-icon" /> */}
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
                <tr>
                  <td>123</td>
                  <td>123</td>
                  <td>123</td>
                  <td>123</td>
                  <td>123</td>
                  <td>123</td>
                  <td>123</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;
