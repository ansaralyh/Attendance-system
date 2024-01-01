import User from "../model/user.model.js";
import bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import Otp from "../model/otp.model.js";
import {format, differenceInMinutes, isSameDay } from 'date-fns';
import Counter from "../model/counter.model.js";


dotenv.config()
const SECRET = process.env.SECRET;

// Registering a new user 
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(401).json({
        success: false,
        message: "User already exists"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, password: hashedPassword, email, role });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({
      message: "Error saving user"
    });
  }
}

// Loging in user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist"
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res.status(401).json({
        message: "Password does not match"
      });
    }

    const token = Jwt.sign({ userEmail: user.email, userRole: user.role }, SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "User logged in successfully!",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();

    if (!allUsers) {
      return res.status(404).json({
        messege: "Unable to fetch users"
      })
    }
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({
      message: "server error"
    });
  }
}

// Get single user
export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const singleUser = await User.findOne({ _id: userId });
    if (!singleUser) {
      return res.status(404).json({
        message: `User with this ${userId} not found`
      });
    }
    res.status(200).json({
      data: singleUser
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

// Delete a user
export const removeUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const removedUser = await User.deleteOne({ _id: userId });
    res.status(201).json({
      message: 'User deleted',
    })
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

// Update an existing user
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetails = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, userDetails);
    if (!updatedUser) {
      return res.status(401).json({
        message: "User not found"
      })
    }
    res.status(201).json({
      message: 'User Updated Successfully',
      updatedUser
    })
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

// Forgot Password
export const forgetPasword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ansaralyh@gmail.com',
        pass: 'rbxi feyw kbix rjkd',
      },
    });

    const generatedOTP = crypto.randomBytes(3).toString('hex');
    console.log(generatedOTP);

    const mailOptions = {
      from: 'ansaralyh@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${generatedOTP}`,
    };

    await transporter.sendMail(mailOptions);

    const storedOTP = new Otp({
      otp: generatedOTP,
      email,
    });
    await storedOTP.save();

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Verify OTP and Update Password
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedOtp = await Otp.findOne({ email, otp });

    if (!storedOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();
      await storedOtp.deleteOne();

      return res.status(200).json({ message: 'Password updated successfully' });
    } else {
      return res.status(400).json({ error: 'User not verified' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Check-in
// Check-in
export const checkIn = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: `User with this ${userId} not found`,
      });
    }

  
    user.checkInsAndOuts = user.checkInsAndOuts || [];

    const lastCheckInRecord = user.checkInsAndOuts[user.checkInsAndOuts.length - 1];
    if (lastCheckInRecord && isSameDay(new Date(), lastCheckInRecord.checkIn)) {
      return res.status(400).json({
        message: 'User has already checked in today',
      });
    }

    const checkInTime = new Date();
    const checkInRecord = {
      checkIn: checkInTime,
    };

    user.checkInsAndOuts.push(checkInRecord);
    await user.save();

    const formattedCheckInTime = format(checkInTime, 'yyyy-MM-dd HH:mm:ss');

    res.status(200).json({
      message: 'Check-in recorded successfully!',
      checkInRecord: {
        checkIn: formattedCheckInTime,
      },
    });
  } catch (error) {
    console.error('Error recording check-in:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// Check-out
export const checkOut = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: `User with this ${userId} not found`,
      });
    }

    // Ensure that checkInsAndOuts is initialized
    user.checkInsAndOuts = user.checkInsAndOuts || [];

    // Check if the user has already checked out today
    const lastCheckInRecord = user.checkInsAndOuts[user.checkInsAndOuts.length - 1];
    if (lastCheckInRecord && lastCheckInRecord.checkOut && isSameDay(new Date(), lastCheckInRecord.checkOut)) {
      return res.status(400).json({
        message: 'User has already checked out today',
      });
    }

    const checkOutTime = new Date();
    const retrievedCheckInRecord = user.checkInsAndOuts.pop(); // Retrieve the last check-in record

    if (retrievedCheckInRecord && !retrievedCheckInRecord.checkOut) {
      retrievedCheckInRecord.checkOut = checkOutTime;

      // Calculate total hours worked
      const checkInTime = retrievedCheckInRecord.checkIn;
      const totalHoursWorked = calculateTotalHours(checkInTime, checkOutTime);

      retrievedCheckInRecord.totalHours = totalHoursWorked;

      user.checkInsAndOuts.push(retrievedCheckInRecord);
      await user.save();

      const formattedCheckOutTime = format(checkOutTime, 'yyyy-MM-dd HH:mm:ss');

      res.status(200).json({
        message: 'Check-out recorded successfully!',
        checkOutTime: formattedCheckOutTime,
        totalHoursWorked,
      });
    } else {
      res.status(400).json({
        message: 'No active check-in record found',
      });
    }
  } catch (error) {
    console.error('Error recording check-out:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};


//  function to calculate total hours worked
const calculateTotalHours = (checkInTime, checkOutTime) => {
  const totalMinutesWorked = differenceInMinutes(checkOutTime, checkInTime);
  const hours = Math.floor(totalMinutesWorked / 60);
  const minutes = totalMinutesWorked % 60;
  return hours + minutes / 60;
};


// Count the number of users
export const countUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllCounters = async (req, res) => {
  try {
    // Fetch all users
    const allUsers = await User.find();

    if (!Array.isArray(allUsers)) {
      return res.status(404).json({ message: "No users found" });
    }

    
    let onTimeCount = 0;
    let lateArrivalCount = 0;
    let absentCount = 0;
    allUsers.forEach(user => {
      if (user.checkInsAndOuts && Array.isArray(user.checkInsAndOuts)) {
        user.checkInsAndOuts.forEach(checkInOut => {
          if (checkInOut.totalHours === 0) {
            // Absent
            absentCount++;
          } else if (checkInOut.totalHours > 0 && checkInOut.totalHours <= 9) {
           
            onTimeCount++;
          } else {
            
            lateArrivalCount++;
          }
        });
      }
    });

    
    const counter = await Counter.findOne(); 
    if (counter) {
      counter.onTimeCount = onTimeCount;
      counter.lateArrivalCount = lateArrivalCount;
      counter.absentCount = absentCount;
      await counter.save();
    } else {
      await Counter.create({ onTimeCount, lateArrivalCount, absentCount });
    }

 
    res.status(200).json({
      onTimeCount,
      lateArrivalCount,
      absentCount,
    });
  } catch (error) {
    console.error("Error fetching counters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

