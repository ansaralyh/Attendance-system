import React, { useState, useEffect } from "react";
import axios from "axios";
import "./emp.css";
import "bootstrap/dist/css/bootstrap.css";
import { persistor } from "../../features/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearState } from "../../features/auth/loginSlice";
import {
  addCheckIn,
  addCheckOut,
  getCheckInOutData,
} from "../../features/checkIn/checkInSlice";
import { formatTime, formatWorkDuration, parseDate } from "../../utills/dates";

const EmpDashboard = () => {
  const dispatch = useDispatch();
  const { success, user } = useSelector((state) => state.auth);
  
  const {
    loading,
    error,
    checkInLoading,
    checkInSuccess,
    checkInError,
    data,
    checkOutLoading,
    checkOutError,
    checkOutSuccess,
  } = useSelector((state) => state.checkInOut);

  useEffect(() => {
    if (checkOutSuccess) {
      window.alert("Checkout success");
    }
    if (checkInSuccess) {
      window.alert("Checkin success");
    }
    if (checkInError) {
      window.alert(checkInError);
    }
    if (checkOutError) {
      window.alert(checkOutError);
    }
  }, [checkOutSuccess, checkInSuccess, checkInError, checkOutError]);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentDay, setCurrentDay] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

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
    const currentDate = new Date();
    setCurrentDay(daysOfWeek[currentDate.getDay()]);
    setFormattedDate(currentDate.toLocaleDateString());
    setFormattedTime(
      currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };
  useEffect(() => {
    const intervalId = setInterval(updateDateTime, 1000); 
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    dispatch(clearState());
  };
  useEffect(() => {
    if (!success) {
      navigate("/");
    }
  }, [navigate, success]);

  useEffect(() => {
    if (user?.user?._id) {
      const apiData = {
        id: user.user._id
      };
      dispatch(getCheckInOutData(apiData));
    }
  }, [dispatch, user?.user?._id]);

  const handleCheckIn = () => {
    if (user?.user?._id) {
      dispatch(addCheckIn({ id: user.user._id }));
      dispatch(getCheckInOutData({ id: user.user._id }));
    }
  };

  const handleCheckOut = () => {
    if (user?.user?._id) {
      dispatch(addCheckOut({ id: user.user._id }));
      dispatch(getCheckInOutData({ id: user.user._id }));
    }
  };

  return (
    <div className="adminDashboard">
      <div className="container">
        <header>
          <p>Karakorum International University</p>
          <div className="right-icons">
            <img src="/assets/icons8-add-user-50.png" alt="" />
            <img src="/assets/notification-bing.png" alt="" />
            <button className="btn btn-danger" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        <p className="dash">Dashboard</p>

        {loading ? (
          <h1>Loading...</h1>
        ) : !error ? (
          <>
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
                <button onClick={handleCheckIn}>
                  {checkInLoading ? "Loading..." : "Check In"}
                </button>
                <button onClick={handleCheckOut}>
                  {checkOutLoading ? "Loading..." : "Check Out"}
                </button>
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
                      <td>Date</td>

                      <td>Check in </td>
                      <td>check out</td>
                      <td>Work hours</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      (data?.data?.checkInsAndOuts?.length > 0 ? (
                        data?.data?.checkInsAndOuts.map((d, index) => {
                          return (
                            <tr key={index}>
                              <td>{new Date(d?.checkIn).toDateString()}</td>
                            
                              <td>
                                {d?.checkIn ? formatTime(d?.checkIn) : "-"}
                              </td>
                              <td>
                                {d?.checkOut ? formatTime(d?.checkOut) : "-"}
                              </td>
                              <td>
                                {d?.checkIn && d?.checkOut
                                  ? formatWorkDuration(d?.checkIn, d?.checkOut)
                                  : "-"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <h1>No CheckIn data found</h1>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <h1>{error}</h1>
        )}
      </div>
    </div>
  );
};

export default EmpDashboard;
