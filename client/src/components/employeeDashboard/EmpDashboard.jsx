import React, {useEffect, useState} from "react";
import './emp.css'

const Admin = () => {
  const [currentDateTime] = useState(new Date());
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
    <p className="total-number">452</p>
    <p className="total-head">Total employees present</p>
  </div>
  <div className="total-employees">
    <p className="total-number">350</p>
    <p className="total-head">On time</p>
  </div>
  <div className="total-employees">
    <p className="total-number">300</p>
    <p className="total-head">Absent</p>
  </div>
  <div className="total-employees">
    <p className="total-number">250</p>
    <p className="total-head">Late Arrivals</p>
  </div>
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

export default Admin;
