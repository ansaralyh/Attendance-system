import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./admin.css";
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearState } from "../../features/auth/loginSlice";
import { formatTime, formatWorkDuration } from "../../utills/dates";

const Admin = () => {
  const dispatch = useDispatch();
  const { success, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateArrivalCount, setLateArrivalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!success) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please login again.");
          return;
        }

        // Get user count
        const countResponse = await axios.get(
          "http://localhost:8080/api/admin/countUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (countResponse.data) {
          setTotalEmployees(countResponse.data.userCount); // ✅ FIXED
        }

        // Get all users
        const usersResponse = await axios.get(
          "http://localhost:8080/api/admin/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (usersResponse.data) {
          const currentUserId = user?.user?._id;
          const filteredUsers = currentUserId
            ? usersResponse.data.filter((u) => u._id !== currentUserId)
            : usersResponse.data;

          setUsers(filteredUsers);

          // Dummy counters for now
          setOnTimeCount(5);
          setAbsentCount(2);
          setLateArrivalCount(4);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [success, navigate, user]);

  const formatHoursAndMinutesToString = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const convertHoursStringToDecimal = (hoursString) => {
    if (typeof hoursString !== "string") return 0;

    const match = hoursString.match(/^(\d+(\.\d+)?)\s*hour(?:s)?(?:\s+(\d+)\s*minute(?:s)?)?/);
    const hours = parseFloat(match?.[1] || 0);
    const minutes = parseInt(match?.[3] || 0);
    return Math.round(hours * 60 + minutes);
  };

  const handleLogout = () => {
    dispatch(clearState());
  };

  const generatePDF = async () => {
    try {
      const responseUsers = await axios.get(
        "http://localhost:8080/api/admin/getAllusers",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const allUsersData = responseUsers.data;
      const pdf = new jsPDF();
      pdf.text("Attendance Overview", 20, 20);

      pdf.autoTable({
        head: [["ID", "First Name", "Last Name", "Date", "Check In", "Check Out", "Work Hours"]],
        startY: 30,
      });

      allUsersData.forEach((user) => {
        (user.checkinsAndOuts || []).forEach((checkInOut) => {
          const rowData = [
            user._id,
            user.firstName,
            user.lastName,
            new Date(checkInOut.date).toLocaleDateString(),
            checkInOut.checkIn
              ? new Date(checkInOut.checkIn).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            checkInOut.checkOut
              ? new Date(checkInOut.checkOut).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            formatHoursAndMinutesToString(
              convertHoursStringToDecimal(checkInOut.totalHours)
            ),
          ];

          pdf.autoTable({
            body: [rowData],
            startY: pdf.autoTable.previous.finalY || 40,
          });
        });
      });

      pdf.save("attendance_overview.pdf");
    } catch (error) {
      console.error("PDF Generation Error:", error);
    }
  };

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = daysOfWeek[currentDateTime.getDay()];
  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="adminDashboard">
      <div className="container">
        <header>
          <p>Karakorum International University</p>
          <div className="right-icons">
            <img src="/assets/icons8-add-user-50.png" alt="" />
            <img src="/assets/notification-bing.png" alt="" />
            <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
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
              <input type="date" />
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
                    <tr>
                      <td>{user._id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>
                        {user?.checkInsAndOuts?.[0]?.checkIn
                          ? new Date(user.checkInsAndOuts[0].checkIn).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {user?.checkInsAndOuts?.[0]?.checkIn
                          ? formatTime(user.checkInsAndOuts[0].checkIn)
                          : "-"}
                      </td>
                      <td>
                        {user?.checkInsAndOuts?.[0]?.checkOut
                          ? formatTime(user.checkInsAndOuts[0].checkOut)
                          : "-"}
                      </td>
                      <td>
                        {user?.checkInsAndOuts?.[0]?.checkOut &&
                        user?.checkInsAndOuts?.[0]?.checkIn
                          ? formatWorkDuration(
                              user.checkInsAndOuts[0].checkIn,
                              user.checkInsAndOuts[0].checkOut
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
            <button onClick={generatePDF} className="btn btn-primary">
              Download All PDFs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
