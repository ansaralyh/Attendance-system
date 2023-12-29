import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    checkinsAndOuts: [
        {
            checkIn: {
                type: Date
            },
            checkOut: {
                type: Date
            },
            date: {
                type: Date
            },
            totalHours: {
                type: Number
            },
            minutes:{
                type : Number
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

export default User;
