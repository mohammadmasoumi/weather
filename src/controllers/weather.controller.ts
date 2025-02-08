import { RequestHandler } from "express";
import { WeatherService } from "../services/weather.service";
import { CustomError } from "../utils/CustomError";
import { Weather } from "../entities/Weather";

const weatherService = new WeatherService();

// ✅ Define request parameter types
interface WeatherIdParams {
    id: string;
}

interface WeatherCityParams {
    cityName: string;
}

interface FetchWeatherBody {
    cityName: string;
    country: string;
}

interface UpdateWeatherBody {
    temperature?: number;
    description?: string;
    humidity?: number;
    windSpeed?: number;
}

// ✅ Get all weather records
export const getAllWeather: RequestHandler = async (req, res, next) => {
    try {
        const data: Weather[] = await weatherService.getWeather();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// ✅ Get weather by ID
export const getWeatherById: RequestHandler<WeatherIdParams> = async (req, res, next) => {
    try {
        const data = await weatherService.getWeatherById(req.params.id);
        if (!data) {
            return next(new CustomError("Weather record not found", 404));
        }
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// ✅ Fetch new weather data
export const fetchWeather: RequestHandler<{}, {}, FetchWeatherBody> = async (req, res, next) => {
    try {
        const data = await weatherService.fetchWeather(req.body.cityName, req.body.country);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

// ✅ Update weather record
export const updateWeather: RequestHandler<WeatherIdParams, {}, UpdateWeatherBody> = async (req, res, next) => {
    try {
        const data = await weatherService.updateWeather(req.params.id, req.body);
        if (!data) {
            return next(new CustomError("Weather record not found", 404));
        }
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// ✅ Delete weather record
export const deleteWeather: RequestHandler<WeatherIdParams> = async (req, res, next) => {
    try {
        await weatherService.deleteWeather(req.params.id);
        res.status(200).json({ message: "Weather record deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// ✅ Get latest weather for a city
export const getLatestWeather: RequestHandler<WeatherCityParams> = async (req, res, next) => {
    try {
        const data = await weatherService.getLatestWeather(req.params.cityName);
        if (!data) {
            return next(new CustomError("No weather data found for this city", 404));
        }
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
