import app from "./app";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database and start the server
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully!");
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/api/`));

    })
    .catch((error) => console.error("❌ Database connection error:", error));
