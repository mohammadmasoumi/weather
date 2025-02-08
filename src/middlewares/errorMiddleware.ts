import { Request, Response, NextFunction } from "express";
import path from "path";
import { CustomError } from "../utils/CustomError";

// ✅ 404 Not Found Middleware
export const notFoundHandler = (req: Request, res: Response): void => {
    if (req.accepts("html")) {
        return res.status(404).sendFile(path.join(__dirname, "../../public/404.html"));
    }

    res.status(404).json({
        status: "error",
        message: "🔍 The requested resource was not found on this server.",
    });
};

// ✅ Global Error Handler (500 Internal Server Error)
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    console.error("🔥 Error: ", err);

    if (req.accepts("html")) {
        return res.status(500).sendFile(path.join(__dirname, "../../public/500.html"));
    }

    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ error: err.message });
    } else if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    } else {
        res.status(500).json({
            status: "error",
            message: "💥 Something went wrong! Please try again later.",
        });
    }
};