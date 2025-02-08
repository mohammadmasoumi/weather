import express, { Application } from "express";
import "reflect-metadata";
import {setupSwagger} from "./utils/swagger";
import weatherRoutes from "./routes/weather.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware";

const app: Application = express();

// Middleware
app.use(express.json()); // ✅ Enables JSON request body parsing

// Swagger Docs
setupSwagger(app);

// ✅ Register API routes
app.use("/api", weatherRoutes);
app.use("/api", userRoutes);

// ✅ Handle 404 Not Found
app.use(notFoundHandler);

// ✅ Global Error Handling Middleware
app.use(errorHandler);


export default app;
