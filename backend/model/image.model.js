import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    image:{
        type:String,
    }
 

});

const ImageModel = mongoose.model("images", imageSchema);
export default ImageModel;
