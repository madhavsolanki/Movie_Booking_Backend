import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  screenName:{
    type:String,
    required:true,
  },
  totalSeats:{
    type:Number,
    required:true,
  },
  screenType:{
    type:String,
    enum:["2D","3D","IMAX"],
    required:true,
  },
  isActive:{
    type:Boolean,
    default:true,
  }
},{timestamps:true});

const Screen = mongoose.model("Screen",screenSchema);

export default Screen;