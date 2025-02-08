import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError";
import dotenv from "dotenv";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export class UserService {
    // ✅ Register a new user
    public async register(email: string, password: string): Promise<{ message: string }> {
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new CustomError("Email already in use", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository.create({ email, password: hashedPassword });
        await userRepository.save(user);

        return { message: "User registered successfully" };
    }

    // ✅ Authenticate user and generate JWT token
    public async login(email: string, password: string): Promise<{ token: string }> {
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            throw new CustomError("Invalid credentials", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("Invalid credentials", 401);
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        return { token };
    }

    // ✅ Fetch user details
    public async getUserById(userId: string): Promise<User | null> {
        return await userRepository.findOne({ where: { id: userId } });
    }
}
