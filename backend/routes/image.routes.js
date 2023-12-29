import express from "express";
const router = express.Router();
import { ImageProcessing } from "../controllers/image.controller.js";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null,"upload/")
    },
    filename:(req,file,callback)=>{
        callback(null,Date.now() + path.extname(file.originalname))
    }
})

const uploadImage = multer({
    storage:storage,
    

})

router.post("/upload" , uploadImage.single('image') , ImageProcessing);


export default router;