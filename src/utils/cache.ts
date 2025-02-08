import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
});

export const cacheData = async (key: string, value: any, expiration: number) => {
    await redis.set(key, JSON.stringify(value), "EX", expiration);
};

export const getCachedData = async (key: string): Promise<any | null> => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

export default redis;
