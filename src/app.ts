import express, { Application } from "express";
import "reflect-metadata";
import {setupSwagger} from "./utils/swagger";
import weatherRoutes from "./routes/weather.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// Middleware
app.use(express.json()); // ✅ Enables JSON request body parsing

// ✅ Register all routes under `/api`
app.use("/api", weatherRoutes);
app.use("/api", userRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

// Swagger Docs
setupSwagger(app);

export default app;
