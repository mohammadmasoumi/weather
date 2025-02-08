import { AppDataSource } from "../data-source";
import { Weather } from "../entities/Weather";
import { CustomError } from "../utils/CustomError";
import axios from "axios";
import { getCachedData, cacheData } from "../utils/cache";
import dotenv from "dotenv";
import redis from "../utils/cache";

dotenv.config();

const CACHE_EXPIRATION = 300; // 5 minutes

export class WeatherService {
    private weatherRepo = AppDataSource.getRepository(Weather);

    // ✅ Fetch Weather with Caching
    async fetchWeather(cityName: string, country: string): Promise<Weather> {
        const cacheKey = `weather:${cityName}:${country}`;
        const latestCacheKey = `weather:latest:${cityName}`;

        // ✅ Check if weather data is already cached
        const cachedWeather = await getCachedData(cacheKey);
        if (cachedWeather) {
            return cachedWeather;
        }

        // ✅ Fetch weather data from OpenWeather API
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${country}&appid=${apiKey}&units=metric`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            const weather = this.weatherRepo.create({
                cityName,
                country,
                temperature: data.main.temp,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                fetchedAt: new Date(),
            });

            const savedWeather = await this.weatherRepo.save(weather);

            // ✅ Cache new weather data for 5 minutes
            await cacheData(cacheKey, savedWeather, 300);

            // ✅ Update the latest weather record in the database
            await this.weatherRepo.update(
                { cityName },
                { temperature: data.main.temp, description: data.weather[0].description, fetchedAt: new Date() }
            );

            // ✅ Update the latest weather cache
            await cacheData(latestCacheKey, savedWeather, 300);

            return savedWeather;
        } catch (error) {
            throw new CustomError("Failed to fetch weather data", 500);
        }
    }

    // ✅ Get All Weather Data with Caching
    async getWeather(): Promise<Weather[]> {
        const cacheKey = `weather:all`;
        const cachedWeather = await getCachedData(cacheKey);

        if (cachedWeather) {
            return cachedWeather;
        }

        const weatherData = await this.weatherRepo.find();

        // ✅ Cache for 5 minutes
        await cacheData(cacheKey, weatherData, CACHE_EXPIRATION);
        return weatherData;
    }

    // ✅ Get Weather by ID with Caching
    async getWeatherById(id: string): Promise<Weather | null> {
        const cacheKey = `weather:id:${id}`;
        const cachedWeather = await getCachedData(cacheKey);

        if (cachedWeather) {
            return cachedWeather;
        }

        const weather = await this.weatherRepo.findOne({ where: { id } });

        if (weather) {
            await cacheData(cacheKey, weather, CACHE_EXPIRATION);
        }

        return weather;
    }

    // ✅ Update Weather Data (Invalidate Cache)
    async updateWeather(id: string, updates: Partial<Weather>): Promise<Weather | null> {
        await this.weatherRepo.update(id, updates);
        const updatedWeather = await this.weatherRepo.findOne({ where: { id } });

        if (updatedWeather) {
            // ✅ Invalidate and update cache
            await redis.del(`weather:id:${id}`);
            await redis.del(`weather:all`);
            await cacheData(`weather:id:${id}`, updatedWeather, CACHE_EXPIRATION);
        }

        return updatedWeather;
    }

    // ✅ Delete Weather Data (Invalidate Cache)
    async deleteWeather(id: string): Promise<void> {
        await this.weatherRepo.delete(id);

        // ✅ Invalidate the cache
        await redis.del(`weather:id:${id}`);
        await redis.del(`weather:all`);
    }

    // ✅ Get Latest Weather by City (with Caching)
    async getLatestWeather(cityName: string): Promise<Weather | null> {
        const cacheKey = `weather:latest:${cityName}`;
        const cachedWeather = await getCachedData(cacheKey);

        if (cachedWeather) {
            return cachedWeather;
        }

        const weather = await this.weatherRepo.findOne({
            where: { cityName },
            order: { fetchedAt: "DESC" },
        });

        if (weather) {
            await cacheData(cacheKey, weather, CACHE_EXPIRATION);
        }

        return weather;
    }
}
