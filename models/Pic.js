const {Schema,model}= require('mongoose')
const picSchema = new Schema(
  {
    email:String,
   caption: String,
    photos:
     { 
       url:String,
      name: String
     } 
  },
  {
    timestamps: true,
    versionKey: false
  }
)
module.exports = model('Pics', picSchema)
