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
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
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