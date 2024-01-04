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
