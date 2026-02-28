import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;
    public isConnected = false;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST') || 'localhost',
            port: this.configService.get<number>('REDIS_PORT') || 6379,
            password: this.configService.get<string>('REDIS_PASSWORD'),
            db: this.configService.get<number>('REDIS_DB') || 0,
            retryStrategy: (times) => {
                if (times > 3) {
                    console.warn('ADVERTENCIA: Se agotaron los reintentos de Redis. Se está ejecutando sin Redis.');
                    return null; // Stop retrying after 3 attempts
                }
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            enableOfflineQueue: false, // Fail commands immediately when disconnected
        });

        this.client.on('connect', () => {
            this.isConnected = true;
            console.log('✅ Redis connected successfully');
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            console.error('❌ Redis connection error:', err.message);
        });
    }

    onModuleDestroy() {
        this.client.disconnect();
    }

    /**
     * Set a key-value pair with optional TTL (in seconds)
     */
    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (!this.isConnected) return;
        try {
            if (ttl) {
                await this.client.setex(key, ttl, value);
            } else {
                await this.client.set(key, value);
            }
        } catch (error) {
            console.warn(`Redis set error for ${key}:`, error.message);
        }
    }

    /**
     * Get value by key
     */
    async get(key: string): Promise<string | null> {
        if (!this.isConnected) return null;
        try {
            return await this.client.get(key);
        } catch (error) {
            return null;
        }
    }

    /**
     * Delete a key
     */
    async delete(key: string): Promise<void> {
        if (!this.isConnected) return;
        try {
            await this.client.del(key);
        } catch (error) {
            // Ignore delete errors
        }
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        if (!this.isConnected) return false;
        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            return false;
        }
    }

    /**
     * Delete all keys matching a pattern
     */
    async deletePattern(pattern: string): Promise<void> {
        if (!this.isConnected) return;
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(...keys);
            }
        } catch (error) {
            // Ignore
        }
    }

    /**
     * Get TTL of a key (in seconds)
     */
    async getTTL(key: string): Promise<number> {
        if (!this.isConnected) return -1;
        try {
            return await this.client.ttl(key);
        } catch (error) {
            return -1;
        }
    }

    /**
     * Get the raw Redis client for advanced operations
     */
    getClient(): Redis {
        return this.client;
    }
}
