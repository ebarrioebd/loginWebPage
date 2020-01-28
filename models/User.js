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
    password:String,
    name: String,
    lastName:String,
    picture : String,
    role:{
      type:String,
      enum: ['GUEST','EDITOR','ADMIN'],
      default:'GUEST'
  }
  }, 
  {
    timestamps: true,
    versionKey: false
  }
)
module.exports = model('User',userSchema)