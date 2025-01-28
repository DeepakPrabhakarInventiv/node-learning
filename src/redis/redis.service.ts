import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {

    private readonly redis: Redis;

    constructor() {
        // Initialize the Redis connection
        this.redis = new Redis({
            host: 'localhost',
            port: 6379,
            db: 0,  // Use the default database (optional)
        });
    }

    // Method to set cache
    async setCache(key: string, value: string, ttl: number = 3600): Promise<void> {
        await this.redis.set(key, value, 'EX', ttl); // 'EX' sets expiration time (TTL)
    }

    // Method to get cache
    async getCache(key: string): Promise<string | null> {
        const data = await this.redis.get(key);
        return data;
    }

    // Method to delete cache
    async delCache(key: string): Promise<number> {
        return await this.redis.del(key);
    }


}
