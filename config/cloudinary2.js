const cloudinary =require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})
const storage = cloudinaryStorage(
  {
    cloudinary,
    folder: 'filesUser',
    allwedFormats: ['jpg','png','jpeg','gif'],
    filename: (req, file, callback) =>{
      callback(null, file.originalName)
    } 
  }
)
module.exports = multer({storage})