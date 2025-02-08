import { AppDataSource } from "../data-source";
import { Weather } from "../entities/Weather";
import { CustomError } from "../utils/CustomError";
import axios from "axios";
import { getCachedData, cacheData } from "../utils/cache";
import dotenv from "dotenv";
import redis from "../utils/cache";

dotenv.config();

const CACHE_EXPIRATION = 300; // 5 minutes
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";
const GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";


export class WeatherService {
    private weatherRepo = AppDataSource.getRepository(Weather);

    // ✅ Get Latitude & Longitude from City Name
    private async getCoordinates(cityName: string, country: string): Promise<{ lat: number; lon: number }> {
        try {
            const response = await axios.get(GEO_URL, {
                params: {
                    q: `${cityName},${country}`,
                    limit: 1,
                    appid: OPENWEATHER_API_KEY,
                },
            });

            if (!response.data.length) {
                throw new CustomError("City not found", 404);
            }

            return {
                lat: response.data[0].lat,
                lon: response.data[0].lon,
            };
        } catch (error: any) {
            console.error(`❌ Failed to fetch coordinates for ${cityName}, ${country}:`, error);

            // ✅ Only throw a CustomError if it's an expected error
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                throw new CustomError("City not found", 404);
            }

            // ✅ Re-throw original error for global error handler
            throw error;
        }
    }

    // ✅ Fetch Weather Using One Call API v3
    async fetchWeather(cityName: string, country: string): Promise<Weather> {
        const cacheKey = `weather:${cityName}:${country}`;
        const latestCacheKey = `weather:latest:${cityName}`;

        // ✅ Check Cache First
        const cachedWeather = await getCachedData(cacheKey);
        if (cachedWeather) {
            return cachedWeather;
        }

        try {
            // ✅ Get Latitude & Longitude
            const { lat, lon } = await this.getCoordinates(cityName, country);

            // ✅ Fetch Weather Data from One Call API v3
            const response = await axios.get(BASE_URL, {
                params: {
                    lat,
                    lon,
                    exclude: "minutely,alerts",
                    units: "metric",
                    appid: OPENWEATHER_API_KEY,
                },
            });

            const data = response.data;

            // ✅ Create Weather Entry
            const weather = this.weatherRepo.create({
                cityName,
                country,
                temperature: data.current.temp,
                description: data.current.weather[0].description,
                humidity: data.current.humidity,
                windSpeed: data.current.wind_speed,
                fetchedAt: new Date(),
            });

            const savedWeather = await this.weatherRepo.save(weather);

            // ✅ Cache new weather data for 5 minutes
            await cacheData(cacheKey, savedWeather, CACHE_EXPIRATION);

            // ✅ Update Latest Weather Record
            await this.weatherRepo.update(
                { cityName },
                { temperature: data.current.temp, description: data.current.weather[0].description, fetchedAt: new Date() }
            );

            // ✅ Update Latest Weather Cache
            await cacheData(latestCacheKey, savedWeather, CACHE_EXPIRATION);

            return savedWeather;
        } catch (error) {
            // ✅ Pass error to Express error handler instead of catching locally
            if (error instanceof CustomError) {
                throw error; // Let Express handle custom errors
            }
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
