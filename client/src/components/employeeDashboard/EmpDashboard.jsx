import React, { useState, useEffect } from "react";
import axios from "axios";
import "./emp.css";
import "bootstrap/dist/css/bootstrap.css";
import { persistor } from "../../features/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { useDispatch } from "react-redux";
// import { useLoginRedirect } from '../../features/auth/loginSlice';
import { useNavigate } from "react-router-dom";
import { clearState } from "../../features/auth/loginSlice";
// // import { useNavigate } from 'react-router-dom';

const EmpDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.auth);
  const data = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentDay, setCurrentDay] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [checkInRecord, setCheckInRecord] = useState();
  const [checkOutRecord, setCheckOutRecord] = useState();
  const [singleUserData, setSingleUserData] = useState(null);

  // const dispatch = useDispatch();
  // const navigate = useNavigate(); // Get navigate function from React Router

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

  const fetchData = async () => {
    try {
      // if (user && user.id) {
        const authToken = data.user.token;
        const userId = data.user.user._id;
        const response = await axios.get(
          `http://localhost:4000/api/user/getSingleUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response)

       
        setSingleUserData(response.data.data);
        console.log(singleUserData)
      // }
    } catch (error) {
      console.error("Error fetching user:", error);
      // Handle error, show a notification, etc.
    }
  };
  // console.log(data)
  const handleCheckIn = async () => {
    try {
      const authToken = data.user.token;
      const userId = data.user.user._id;
      console.log(userId);
      console.log(authToken);

      if (userId) {
        const response = await axios.post(
          `http://localhost:4000/api/user/checkIn/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response.data);
        setCheckInRecord(response.data.checkInRecord.checkIn);
      } else {
        console.error("User or user ID is undefined");
      }
    } catch (error) {
      console.error("Check-in failed:", error);
      // Handle check-in failure
    }
  };

  const handleCheckOut = async () => {
    try {
      const authToken = data.user.token;
      const userId = data.user.user._id;

      if (userId) {
        const response = await axios.post(
          `http://localhost:4000/api/user/checkOut/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response.data);
        setCheckOutRecord(response.data.checkOutRecord.checkOut);
        // setCheckInRecord(null);
      } else {
        console.error("User or user ID is undefined");
      }
    } catch (error) {
      console.error("Check-out failed:", error);
      // Handle check-out failure
    }
  };



  useEffect(() => {
      fetchData();
  },[]);

  const handleLogout = () => {
    dispatch(clearState());
  };
  useEffect(() => {
    if (!success) {
      navigate("/");
    }
  }, [navigate, success]);

  // useEffect(()=>{
  //   fetchData();
  // })

  return (
    <div className="adminDashboard">
      <div className="container">
        <header>
          <p>Time tracker</p>
          <div className="right-icons">
            <img src="/assets/icons8-add-user-50.png" alt="" />
            <img src="/assets/notification-bing.png" alt="" />
            <button className="btn btn-danger" onClick={handleLogout}>
              Log out
            </button>
            {/* <img src="/assets/Ellipse 940.png" alt="" /> */}
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
            <button onClick={handleCheckIn}>Check In</button>
            <button onClick={handleCheckOut}>Check Out</button>
          </div>
        </div>

        <div className="attendance-overview">
          <div className="attendance-header">
            <p className="attendance-head">Attendance overview</p>
            <div className="search-container">
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
                  <td>ID</td>
                  <td>First Name</td>
                  <td>Last Name</td>
                  <td>Email</td>
                  <td>Check in </td>
                  <td>check out</td>
                  <td>Work hours</td>
                </tr>
              </thead>
              <tbody>
                {singleUserData && (
                  <tr>
                    <td>{singleUserData._id}</td>
                    <td>{singleUserData.firstName}</td>
                    <td>{singleUserData.lastName}</td>
                    <td>{singleUserData.email}</td>
                    <td>
                      {singleUserData.checkinsAndOuts &&
                      singleUserData.checkinsAndOuts.length > 0
                        ? singleUserData.checkinsAndOuts[0].checkIn
                        : "N/A"}
                    </td>
                    <td>
                      {singleUserData.checkinsAndOuts &&
                      singleUserData.checkinsAndOuts.length > 0
                        ? singleUserData.checkinsAndOuts[0].checkOut
                        : "N/A"}
                    </td>
                    <td>
                      {singleUserData.checkinsAndOuts &&
                      singleUserData.checkinsAndOuts.length > 0
                        ? singleUserData.checkinsAndOuts[0].totalHours
                        : "N/A"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;
