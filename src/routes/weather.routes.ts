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

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Weather data management
 */

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get all weather records
 *     tags: [Weather]
 *     description: Retrieve all stored weather data
 *     responses:
 *       200:
 *         description: A list of weather records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Weather'
 *       500:
 *         description: Internal server error
 */
router.get("/weather", getAllWeather);

/**
 * @swagger
 * /api/weather/{id}:
 *   get:
 *     summary: Get weather record by ID
 *     tags: [Weather]
 *     description: Retrieve weather data by a specific record ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Weather record ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved weather record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Weather record not found
 *       500:
 *         description: Internal server error
 */
router.get("/weather/:id", authenticateToken, getWeatherById);

/**
 * @swagger
 * /api/weather:
 *   post:
 *     summary: Fetch and store new weather data
 *     tags: [Weather]
 *     description: Fetches the latest weather data for a city from OpenWeather API and stores it
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cityName
 *             properties:
 *               cityName:
 *                 type: string
 *                 example: "London"
 *               country:
 *                 type: string
 *                 example: "UK"
 *     responses:
 *       201:
 *         description: Weather data successfully stored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/weather", authenticateToken, fetchWeather);

/**
 * @swagger
 * /api/weather/{id}:
 *   put:
 *     summary: Update a weather record
 *     tags: [Weather]
 *     description: Update temperature, description, humidity, or wind speed of a weather record
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Weather record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *                 example: 22.5
 *               description:
 *                 type: string
 *                 example: "Sunny"
 *               humidity:
 *                 type: integer
 *                 example: 60
 *               windSpeed:
 *                 type: number
 *                 example: 5.2
 *     responses:
 *       200:
 *         description: Successfully updated weather record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Weather record not found
 *       500:
 *         description: Internal server error
 */
router.put("/weather/:id", authenticateToken, updateWeather);

/**
 * @swagger
 * /api/weather/{id}:
 *   delete:
 *     summary: Delete a weather record
 *     tags: [Weather]
 *     description: Permanently remove a weather record from the database
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Weather record ID
 *     responses:
 *       204:
 *         description: Successfully deleted weather record
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Weather record not found
 *       500:
 *         description: Internal server error
 */
router.delete("/weather/:id", authenticateToken, deleteWeather);

/**
 * @swagger
 * /api/weather/latest/{cityName}:
 *   get:
 *     summary: Get latest weather for a city
 *     tags: [Weather]
 *     description: Retrieve the most recent weather data for a specific city
 *     parameters:
 *       - in: path
 *         name: cityName
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *     responses:
 *       200:
 *         description: Latest weather record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       404:
 *         description: No weather data found
 *       500:
 *         description: Internal server error
 */
router.get("/weather/latest/:cityName", getLatestWeather);

export default router;
