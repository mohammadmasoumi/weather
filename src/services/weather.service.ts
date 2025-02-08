import { AppDataSource } from "../data-source";
import axios from "axios";
import { Weather } from "../entities/Weather";
import { CustomError } from "../utils/CustomError";
import dotenv from "dotenv";

dotenv.config();

export class WeatherService {
    private weatherRepo = AppDataSource.getRepository(Weather);

    async fetchWeather(cityName: string, country: string): Promise<Weather> {
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

            return await this.weatherRepo.save(weather);
        } catch (error) {
            throw new CustomError("Failed to fetch weather data", 500);
        }
    }

    async getWeather(): Promise<Weather[]> {
        return this.weatherRepo.find();
    }

    async getWeatherById(id: string): Promise<Weather | null> {
        return this.weatherRepo.findOne({ where: { id } });
    }

    async updateWeather(id: string, updates: Partial<Weather>): Promise<Weather | null> {
        await this.weatherRepo.update(id, updates);
        return this.weatherRepo.findOne({ where: { id } });
    }

    async deleteWeather(id: string): Promise<void> {
        await this.weatherRepo.delete(id);
    }

    async getLatestWeather(cityName: string): Promise<Weather | null> {
        return this.weatherRepo.findOne({
            where: { cityName },
            order: { fetchedAt: "DESC" },
        });
    }
}
