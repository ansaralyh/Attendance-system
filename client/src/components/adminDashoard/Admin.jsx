import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./admin.css";
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearState } from "../../features/auth/loginSlice";
import { formatTime, formatWorkDuration } from "../../utills/dates";

const Admin = () => {
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.auth);
  const data = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateArrivalCount, setLateArrivalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCount = await fetch(
          "http://localhost:4000/api/admin/countUsers"
        );
        const dataCount = await responseCount.json();

        if (typeof dataCount === "number") {
          setTotalEmployees(dataCount);
        } else {
          console.error(
            "Invalid user count data format. Expected a number:",
            dataCount
          );
        }

        
        setOnTimeCount(5);
        setAbsentCount(2); 
        setLateArrivalCount(4); 

        // Fetch user data
        const authToken = data.user.token;
        const responseUsers = await axios.get(
          "http://localhost:4000/api/admin/getAllusers",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (responseUsers.status >= 200 && responseUsers.status < 300) {
          const allUsersData = responseUsers.data;

          const loggedInUserId = data.user.user._id;

          const usersData = allUsersData.filter(
            (user) => user._id !== loggedInUserId
          );

          setUsers(usersData);
          console.log("All Users data:", usersData);

         
          setTotalEmployees(usersData.length);
        } else {
          console.error(
            "Error fetching all users. Status:",
            responseUsers.status
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatHoursAndMinutesToString = (totalMinutes) => {
    const hours = Math.ceil(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (hours === 1) {
      return `${hours} hour${
        minutes !== 0 ? ` and ${minutes} minute${minutes !== 1 ? "s" : ""}` : ""
      }`;
    } else {
      return `${hours} hours${
        minutes !== 0 ? ` and ${minutes} minute${minutes !== 1 ? "s" : ""}` : ""
      }`;
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
    if (typeof hoursString !== "string") {
      return 0;
    }

    const match = hoursString.match(
      /^(\d+(\.\d+)?)\s*hour(s)?(\s+(\d+)\s*minute(s)?)?/
    );

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

  const handleLogout = () => {
    dispatch(clearState());
  };

  const generatePDF = async () => {
    try {
      const responseUsers = await axios.get(
        "http://localhost:4000/api/admin/getAllusers",
        {
          headers: {
            Authorization: `Bearer ${data.user.token}`,
          },
        }
      );
  
      if (responseUsers.status >= 200 && responseUsers.status < 300) {
        const allUsersData = responseUsers.data;
  
        const pdf = new jsPDF();
        pdf.text("Attendance Overview", 20, 20);
  
        const headers = [
          "ID",
          "First Name",
          "Last Name",
          "Date",
          "Check In",
          "Check Out",
          "Work Hours",
        ];
        const startY = 30;
  
        pdf.autoTable({
          head: [headers],
          startY,
        });
  
        for (const user of allUsersData) {
          for (const checkInOut of user.checkinsAndOuts || []) {
            const rowData = [
              user._id,
              user.firstName,
              user.lastName,
              new Date(checkInOut.date).toLocaleDateString(),
              new Date(checkInOut.checkIn).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              new Date(checkInOut.checkOut).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              formatHoursAndMinutesToString(
                convertHoursStringToDecimal(checkInOut.totalHours)
              ),
            ];
                
            pdf.autoTable({
              body: [rowData],
              startY: pdf.autoTable.previous.finalY,
            });
          }
        }
  
        pdf.save("attendance_overview.pdf");
      } else {
        console.error("Error fetching all users. Status:", responseUsers.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    if (!success) {
      navigate("/");
    }
  }, [navigate, success]);

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
              {/* <img src="/assets/calendar-search.png" alt="" /> */}
              <input type="date" />
              {/* <p className="filter-date">29Jun 2023</p> */}
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
                {users.map((user, index) => (
                  <React.Fragment key={user._id}>
                    <tr>
                      <td>{user._id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>
                        {new Date(
                          user?.checkInsAndOuts[0]?.checkIn
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {user?.checkInsAndOuts[0]?.checkIn
                          ? formatTime(user?.checkInsAndOuts[0]?.checkIn)
                          : "-"}
                      </td>
                      <td>
                        {user?.checkInsAndOuts[0]?.checkOut
                          ? formatTime(user?.checkInsAndOuts[0]?.checkOut)
                          : "-"}
                      </td>
                      <td>
                        {user?.checkInsAndOuts[0]?.checkOut &&
                        user?.checkInsAndOuts[0]?.checkIn
                          ? formatWorkDuration(
                              user?.checkInsAndOuts[0]?.checkIn,
                              user?.checkInsAndOuts[0]?.checkOut
                            )
                          : "-"}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <button onClick={generatePDF} className="btn btn-primary">Download All PDFs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
