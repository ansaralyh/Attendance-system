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
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee',
    },
    checkInsAndOuts: [
        {
            checkIn: {
                type: Date
            },
            checkOut: {
                type: Date,
                default:null
            },
            date: {
                type: Date,
                default:null,
            },
            totalHours: {
                type: Number,
                default:null
            },
            minutes:{
                type : Number,
                default:null
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

export default User;
