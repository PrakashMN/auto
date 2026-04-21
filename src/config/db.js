const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    const connection = await mongoose.connect(MONGO_URI);
    isConnected = connection.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB runtime error:", error.message);
});

module.exports = connectDB;
