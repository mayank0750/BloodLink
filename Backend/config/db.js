import mongoose from "mongoose";
import env from "dotenv";

const MONGO_URI = "mongodb+srv://korwatemayur_db_user:143%40Mayur@cluster0.ichpx5r.mongodb.net/?appName=Cluster0";
const dbName = "BloodLink";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: dbName,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;