import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);

    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ error: err.message });
    } else if (err instanceof Error) {
        res.status(500).json({ error: err.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};
