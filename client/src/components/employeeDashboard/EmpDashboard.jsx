import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

const EmpDashboard = () => {
  const navigate = useNavigate();
  const [checkinTime, setCheckinTime] = useState(null);
  const [checkoutTime, setCheckoutTime] = useState(null);

  const handleLogout = () => {
    navigate('/', { replace: true });
  };

  const handleCheckin = () => {
    const currentTime = new Date();
    setCheckinTime(currentTime.toLocaleTimeString());
    console.log(`Checked in at: ${currentTime.toLocaleTimeString()}`);
  };

  const handleCheckout = () => {
    const currentTime = new Date();
    setCheckoutTime(currentTime.toLocaleTimeString());
    console.log(`Checked out at: ${currentTime.toLocaleTimeString()}`);
  };

  return (
    <div className='container'>
      <h1>Employee dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <div>
        <h2>Attendance</h2>
        {checkinTime ? (
          <p>Checked in at: {checkinTime}</p>
        ) : (
          <button onClick={handleCheckin}>Check in</button>
        )}

        {checkoutTime ? (
          <p>Checked out at: {checkoutTime}</p>
        ) : (
          <button onClick={handleCheckout}>Check out</button>
        )}
        <table>
          <thead>
            <tr>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{checkinTime || '-'}</td>
              <td>{checkoutTime || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpDashboard;
