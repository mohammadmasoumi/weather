import { Request, Response, NextFunction } from "express";
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
export const getAllWeather = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data: Weather[] = await weatherService.getWeather();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// ✅ Get weather by ID (Ensure Proper Typing for Request)
export const getWeatherById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
export const fetchWeather = async (
    req: Request<{}, {}, FetchWeatherBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data = await weatherService.fetchWeather(req.body.cityName, req.body.country);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

// ✅ Update weather record
export const updateWeather = async (
    req: Request<{ id: string }, {}, UpdateWeatherBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
export const deleteWeather = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await weatherService.deleteWeather(req.params.id);
        res.status(200).json({ message: "Weather record deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// ✅ Get latest weather for a city
export const getLatestWeather = async (
    req: Request<{ cityName: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
