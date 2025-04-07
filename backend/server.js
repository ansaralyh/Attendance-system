import express from 'express'
const app = express();
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from "./routes/user.routes.js"
import imageRoute from './routes/image.routes.js'
import adminRouter from './routes/admin.routes.js'
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config()
const PORT=process.env.PORT;

app.use(cors('*'))
// data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

// router driver
app.use("/api", router)

app.use('/api',imageRoute)
app.use('/api/admin', adminRouter)

// Database connection 
mongoose.connect("mongodb://127.0.0.1:27017/Haaza-FYP"
).then(() => {
    console.log("connected to database");
})

// Server running code
app.listen(PORT, (req, res) => {
    console.log(`Server is running on ${PORT}`)
})
