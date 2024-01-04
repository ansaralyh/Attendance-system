import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import "./login.css";
import { login } from "../../features/auth/loginSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error, success, user } = useSelector(state => state.auth);
  // console.log(success)
  // console.log(user.user.role)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };
  useEffect(() => {
    if (success  && user?.user?.role) {
      if (user.user.role === "admin") {
        navigate('/admin');
      } else {
        navigate('/empDashboard');
      }
    }
  }, [success, navigate]);
  

  return (
    <div className="container1">
      <div className="form-side">
        <h1>Login to your Account</h1>
  
        <div className="mail-input">
          <input
            type="text"
            placeholder="Enter your Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <img src="/assets/mail-open-outline.png" alt="" />
        </div>
        <div className="mail-input">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <img src="/assets/eye-off-outline.png" alt="" />
        </div>
        <div className="forget-password">
          <div className="check-box">
            <input type="checkbox" />
            Remember Me
          </div>
          <Link to="/">Forget Password?</Link>
        </div>
        <button onClick={handleLogin}>{loading ? "Loading..." : "Sign In"}</button>
        <h5>
          Don’t have an account? <Link to='/signup'>Sign up</Link>
        </h5>
      </div>

      <div className="form-image">
        <img src="/assets/domenico-loia-hGV2TfOh0ns-unsplash.jpg" alt="" />
      </div>
    </div>
  );
};

export default Login;
