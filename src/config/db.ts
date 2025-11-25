import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI as string;
5
    if (!mongoURI) {
      throw new Error("MONGO_URI not found in .env file");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error);
    process.exit(1);
  }
};
export default connectDB;
