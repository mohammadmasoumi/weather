import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { body, validationResult } from "express-validator";
import { User } from "../entities/User";

const userService = new UserService();

// ✅ Register User
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await body("email").isEmail().normalizeEmail().run(req);
    await body("password").isLength({ min: 6 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { email, password } = req.body;

    try {
        const response = await userService.register(email, password);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

// ✅ User Login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await body("email").isEmail().normalizeEmail().run(req);
    await body("password").isLength({ min: 6 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { email, password } = req.body;

    try {
        const response = await userService.login(email, password);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

// ✅ Fetch User Details (Protected Route)
export const getUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const user: User | null = await userService.getUserById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ id: user.id, email: user.email, createdAt: user.createdAt });
    } catch (error) {
        next(error);
    }
};
