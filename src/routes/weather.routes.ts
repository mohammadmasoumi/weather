import { Router } from "express";
import {
    getAllWeather,
    getWeatherById,
    fetchWeather,
    updateWeather,
    deleteWeather,
    getLatestWeather,
} from "../controllers/weather.controller";

const router = Router();

// ✅ Routes are now properly typed
router.get("/weather", getAllWeather);
router.get("/weather/:id", getWeatherById);
router.post("/weather", fetchWeather);
router.put("/weather/:id", updateWeather);
router.delete("/weather/:id", deleteWeather);
router.get("/weather/latest/:cityName", getLatestWeather);

export default router;
