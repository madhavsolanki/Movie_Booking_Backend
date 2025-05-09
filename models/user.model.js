import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName:{
    type:String,
    required:true,
    trim:true,
  },
  phoneNumber:{
    type:String,
    default:"", 
    trim:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
  },
  password:{
    type:String,
    required:true,
    trim:true,
  },
  role:{
    type:String,
    enum:["ADMIN","USER"],
    default:"USER",
  },
  profileAvatar:{
    image_url:{
      type:String,
    },
    image_id:{
      type:String,
    },
  },
  // 	If the account is active (default: true)
  isActive:{
    type:Boolean,
    default:true,
  },
},{timestamps:true});


const User = mongoose.model("User",userSchema);

export default User;