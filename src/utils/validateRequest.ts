import { Request, Response, NextFunction } from "express";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const { cityName, country } = req.body;
    if (!cityName || !country) {
        return res.status(400).json({ error: "cityName and country are required fields." });
    }
    next();
};
