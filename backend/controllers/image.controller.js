import ImageModel from "../model/image.model.js";

export const ImageProcessing = async (req,res)=>{
    try {
        const newImage = new ImageModel({
            image:req.file ? req.file.fileName : undefined,
        })
        await newImage.save(); 
        res.status(200).json({
            success:true,
            messege:"image fetched",
            newImage
        })
    } catch(error)  {
        res.status(500).json({
            messege:"unable to fetch image"
        })
    }
}

