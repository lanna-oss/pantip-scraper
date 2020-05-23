import mongoose from "mongoose";

const connectionString =
  process.env.NODE_ENV === "development" ? "mongodb://mongodb:27017" : "";

export const connectToDataSource = async () => {
  const result = await mongoose.connect(connectionString);
};
