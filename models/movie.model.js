import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  genre:[
    {type:String,required:true},
  ],
  releaseDate:{
    type:Date,
    required:true,
  },
  duration:{
    type:Number,
    required:true,
  },
  poster:{
    image_url:{
      type:String,
      required:true,
    },
    image_id:{
      type:String,
      required:true,
    },
  },
  trailerUrl:{
    type:String,
  },
  isActive:{
    type:Boolean,
    default:true,
  },
  admin_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  }
},{timestamps:true});

const Movie = mongoose.model("Movie",movieSchema);

export default Movie;