import express, { Application } from "express";
import "reflect-metadata";
// import cors from "cors";
import weatherRoutes from "./routes/weather.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// Middleware
// app.use(cors());
app.use(express.json()); // ✅ Enables JSON request body parsing

// ✅ Correctly register the router
app.use("/api", weatherRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

export default app;
