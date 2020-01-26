const {Schema, model}= require('mongoose')
const userSchema = new Schema(
  {
    email:{
      type:String,
      unique: true,
      required: true
    },
    googleId:{
      type : String,
      unique : true,
      sparse: true 
    },
    facebookId:{
      type : String,
      unique : true,
      sparse: true 
    },
    name: String,
    lastName:String
  }, 
  {
    timestamps: true,
    versionKey: false
  }
)
module.exports = model('User',userSchema)