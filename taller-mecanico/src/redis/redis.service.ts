import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST') || 'localhost',
            port: this.configService.get<number>('REDIS_PORT') || 6379,
            password: this.configService.get<string>('REDIS_PASSWORD'),
            db: this.configService.get<number>('REDIS_DB') || 0,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });

        this.client.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });

        this.client.on('error', (err) => {
            console.error('❌ Redis connection error:', err);
        });
    }

    onModuleDestroy() {
        this.client.disconnect();
    }

    /**
     * Set a key-value pair with optional TTL (in seconds)
     */
    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    /**
     * Get value by key
     */
    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    /**
     * Delete a key
     */
    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    /**
     * Delete all keys matching a pattern
     */
    async deletePattern(pattern: string): Promise<void> {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            await this.client.del(...keys);
        }
    }

    /**
     * Get TTL of a key (in seconds)
     */
    async getTTL(key: string): Promise<number> {
        return await this.client.ttl(key);
    }

    /**
     * Get the raw Redis client for advanced operations
     */
    getClient(): Redis {
        return this.client;
    }
}
