import mongoose from "mongoose";
import env from "dotenv";

env.config();

const MONGO_URI = process.env.MONGO_URI;
const dbName = process.env.dbName;

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