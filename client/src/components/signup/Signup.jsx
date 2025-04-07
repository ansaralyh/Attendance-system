import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import './signup.css';

const Signup = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee"
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault(); 
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/user", formData);
      alert('User signup successful');
      console.log(response.data);
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error during signup. Please try again.";
      setError(errorMessage);
      console.error(error.response?.data);
    }
  };

  return (
    <div className="container2">
      <div className="signup-form">
        <h1>Sign up to your Account</h1>
        <div className="form-inner">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          
          {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          
          <form onSubmit={handleSignup}>
            <div className="inputs-fields">
              <div className="first-line">
                <input
                  type="text"
                  placeholder="First name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-icon">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <img src="/assets/mail-open-outline.png" alt="" />
              </div>
              <div className="input-icon">
                <select
                
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                <img src="/assets/mail-open-outline.png" alt="" />
              </div>
              <div className="input-icon">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
                <img src="/assets/eye-off-outline.png" alt="" />
              </div>
              <div className="input-icon">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
                <img src="/assets/eye-off-outline.png" alt="" />
              </div>
            </div>
            <button type="submit">Sign up</button>
          </form>
          <h5>
            Already have an account? <Link to="/">Log In</Link>
          </h5>
        </div>
      </div>
      <div className="signup-image">
        <img src="/assets/carl-heyerdahl-KE0nC8-58MQ-unsplash.jpg" alt="" />
      </div>
    </div>
  );
};

export default Signup;
