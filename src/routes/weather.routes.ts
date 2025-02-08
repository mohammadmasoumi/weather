import { Router } from "express";
import {
    getAllWeather,
    getWeatherById,
    fetchWeather,
    updateWeather,
    deleteWeather,
    getLatestWeather,
} from "../controllers/weather.controller";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();
// ✅ Correctly Typed Route Definitions
/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get current weather
 *     description: Returns weather data for a city
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: "New York"
 *                 temperature:
 *                   type: string
 *                   example: "15°C"
 *                 condition:
 *                   type: string
 *                   example: "Cloudy"
 *       500:
 *         description: Internal server error
 */
router.get("/weather", getAllWeather); // Public
router.get("/weather/:id", authenticateToken, getWeatherById); // Protected
router.post("/weather", authenticateToken, fetchWeather); // Protected
router.put("/weather/:id", authenticateToken, updateWeather); // Protected
router.delete("/weather/:id", authenticateToken, deleteWeather); // Protected
router.get("/weather/latest/:cityName", getLatestWeather); // Public

export default router;
