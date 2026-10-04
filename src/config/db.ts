import dns from "dns";
import mongoose from "mongoose";

// Use IPv4 first
dns.setDefaultResultOrder("ipv4first");

// Use reliable DNS resolvers
dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is missing from .env"
      );
    }

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(mongoUri, {
      family: 4,

      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,

      maxPoolSize: 10,
      minPoolSize: 1,

      retryWrites: true,
      retryReads: true,
    });

    console.log("");
    console.log("====================================");
    console.log(" MongoDB Atlas Connected Successfully");
    console.log("====================================");
    console.log(
      "Database:",
      mongoose.connection.name
    );
    console.log("");
  } catch (error) {
    console.error("");
    console.error("====================================");
    console.error(" MongoDB Connection Failed");
    console.error("====================================");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    throw error;
  }
};

export default connectDB;