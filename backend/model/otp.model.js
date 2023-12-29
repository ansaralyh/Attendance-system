import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String
    },
    otp:{
        type:String
    }
})
const Otp = mongoose.model("otp",otpSchema);
export default Otp;