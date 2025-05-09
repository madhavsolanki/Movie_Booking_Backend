import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  show:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Show",
    required:true,
  },
  seatsBooked:{
    type:Number,
    required:true,
  },
  totalPrice:{
    type:Number,
    required:true,
  },
  bookingDate:{
    type:Date,
    required:true,
  },
  paymentStatus:{
    type:String,
    enum:["PENDING","SUCCESS","FAILED"],
    default:"PENDING",
  },
  isActive:{
    type:Boolean,
    default:true,
  },
},{timestamps:true});

const Booking = mongoose.model("Booking",bookingSchema);

export default Booking;