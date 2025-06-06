import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected with ${connection.host}`);
  }
  catch (error) {
    console.log(`MongoDB connection error ${error}`);
    process.exit(1);
  }
};

export default connectDB;