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
 * /api/weather:
 *   get:
 *     summary: Get all weather records
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
router.get("/weather", getAllWeather); // Public

/**
 * @swagger
 * /api/weather/{id}:
 *   get:
 *     summary: Get weather record by ID
 *     description: Retrieve weather data by a specific record ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Weather record ID
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved weather record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       404:
 *         description: Weather record not found
 *       500:
 *         description: Internal server error
 */
router.get("/weather/:id", authenticateToken, getWeatherById); // Protected

/**
 * @swagger
 * /api/weather:
 *   post:
 *     summary: Fetch and store new weather data
 *     description: Fetches the latest weather data for a city from OpenWeather API and stores it in the database
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       500:
 *         description: Internal server error
 */
router.post("/weather", authenticateToken, fetchWeather); // Protected

/**
 * @swagger
 * /api/weather/{id}:
 *   put:
 *     summary: Update an existing weather record
 *     description: Allows updating temperature, description, humidity, or wind speed of a stored weather record
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Weather record ID
 *         schema:
 *           type: string
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
 *       404:
 *         description: Weather record not found
 *       500:
 *         description: Internal server error
 */
router.put("/weather/:id", authenticateToken, updateWeather); // Protected

/**
 * @swagger
 * /api/weather/{id}:
 *   delete:
 *     summary: Delete a weather record
 *     description: Removes a specific weather record from the database
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Weather record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted weather record
 *       404:
 *         description: Weather record not found
 *       500:
 *         description: Internal server error
 */
router.delete("/weather/:id", authenticateToken, deleteWeather); // Protected

/**
 * @swagger
 * /api/weather/latest/{cityName}:
 *   get:
 *     summary: Get the latest weather for a city
 *     description: Retrieve the most recent weather data for a specific city
 *     parameters:
 *       - name: cityName
 *         in: path
 *         required: true
 *         description: Name of the city
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved latest weather record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       404:
 *         description: No weather data found for this city
 *       500:
 *         description: Internal server error
 */
router.get("/weather/latest/:cityName", getLatestWeather); // Public

export default router;
