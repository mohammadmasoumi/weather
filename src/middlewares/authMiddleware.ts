import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: JwtPayload | string; // ✅ Extend Request type to include `user`
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return; // ✅ Ensure function returns void
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded; // ✅ Attach user data to request object
        next(); // ✅ Proceed to next middleware or route handler
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({ message: "Unauthorized: Token has expired" });
            return; // ✅ Ensure function returns void
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: "Forbidden: Invalid token" });
            return; // ✅ Ensure function returns void
        }
        next(error); // ✅ Forward other errors to global error handler
    }
};
