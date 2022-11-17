const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  email:{
    type:String,
    required: [true, "Please Enter  Email"],
    unique:true
  },
  userName: {
    type: String,
    required: [true, "Please Enter profile UserName"],
    trim: true,
    unique:true
  },
  password:{
    type:String,
    required: [true, "Please Enter  Password"],
  },
  profilePic: {
    type:String,
    required:true,
    default:"https://lh3.googleusercontent.com/rRuk-xtEg28mkFYfLAnClC-UNrCGc2mPqvA_72fcUFM-zy6XTNkuFs9uWG8klzkRCyQRkDdmc-5AAqG-9EY-D4R1W865MhJnA6TFGg"
  },
  bio: {
    type: String,
    required: [true, "Please Enter Profile  Bio"],
    default: 'My Nfts Collection' ,
  },
  twitterName:{type:String},
  facebookName:{type:String},
  personalURL:{type:String},

},{ timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);