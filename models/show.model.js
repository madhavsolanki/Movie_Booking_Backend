import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movie:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Movie",
    required:true,
  },
  screen:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Screen",
    required:true,
  },
  showTime:{
    type:Date,
    required:true,
  },
  availableSeats:{
    type:Number,
    required:true,
  },
  bookedSeats:{
    type:Number,
    default:0,
  },
  isActive:{
    type:Boolean,
    default:true,
  },
},{timestamps:true});

 const Show = mongoose.model("Show",showSchema);

 export default Show;