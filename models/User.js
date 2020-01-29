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
    picture : {
      type:String,
      default:"https://res.cloudinary.com/dzyssenr4/image/upload/v1580245880/img/logIcono_prorlk.png"
      },
      media:{
       type: Object,
       default:[{"name":"https://res.cloudinary.com/dzyssenr4/image/upload/v1580261265/filesUser/x2slejdcsibzkxrtkrsf.jpg"}]
      },
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