import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";

dotenv.config();

import express, { Request, Response, NextFunction } from "express";

import cors from "cors";

import connectDB from "./config/db";
import contactRoutes from "./routes/contactRoutes";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

/* =========================================
   CORS
========================================= */

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman / server-to-server
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  }),
);

/* =========================================
   BODY PARSER
========================================= */

app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

/* =========================================
   ROOT
========================================= */

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Amit.dev backend API is running.",
  });
});

/* =========================================
   HEALTH
========================================= */

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is healthy.",
    database: "MongoDB Atlas",
  });
});

/* =========================================
   CONTACT
========================================= */

app.use("/api/contact", contactRoutes);

/* =========================================
   404
========================================= */

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

/* =========================================
   ERROR HANDLER
========================================= */

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server Error:", error.message);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

/* =========================================
   START SERVER
========================================= */

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log("");
      console.log("====================================");
      console.log("       AMIT.DEV BACKEND SERVER");
      console.log("====================================");

      console.log(`Server  : http://localhost:${PORT}`);

      console.log(`Health  : http://localhost:${PORT}/api/health`);

      console.log(`Contact : http://localhost:${PORT}/api/contact`);

      console.log("====================================");

      console.log("");
    });
  } catch (error) {
    console.error("");
    console.error("====================================");
    console.error(" DATABASE CONNECTION FAILED");
    console.error(" SERVER NOT STARTED");
    console.error("====================================");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
};

/* =========================================
   PROCESS ERRORS
========================================= */

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);

  process.exit(1);
});

/* =========================================
   START
========================================= */

startServer();
