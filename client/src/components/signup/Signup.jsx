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
    role:""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post("http://localhost:4000/api/user", formData);
      alert('user signup successfully')
      console.log(response.data);
      navigate("/");
     
    } catch (error) {
      alert('error signup ')
      console.error(error.response.data);
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
          
          <form onSubmit={handleSignup}>
            <div className="inputs-fields">
              <div className="first-line">
                <input
                  type="text"
                  placeholder="First name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-icon">
                <input
                  type="text"
                  placeholder="Enter your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <img src="/assets/mail-open-outline.png" alt="" />
              </div>
              <div className="input-icon">
                <input
                  type="text"
                  placeholder="Enter your role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                />
                <img src="/assets/mail-open-outline.png" alt="" />
              </div>
              <div className="input-icon">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <img src="/assets/eye-off-outline.png" alt="" />
              </div>
              <div className="input-icon">
                <input
                  type="password"
                  placeholder="Confirmed Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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
