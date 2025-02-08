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
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export class WeatherService {
    private weatherRepo = AppDataSource.getRepository(Weather);

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
            // ✅ Fetch Weather Data from One Call API v3
            const response = await axios.get<WeatherData>(BASE_URL, {
                params: {
                    q: `${cityName},${country}`,
                    appid: OPENWEATHER_API_KEY,
                    units: 'metric', // Use 'imperial' for Fahrenheit
                },
            });

            const data = response.data;

            // ✅ Create Weather Entry
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
            await cacheData(cacheKey, savedWeather, CACHE_EXPIRATION);

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
