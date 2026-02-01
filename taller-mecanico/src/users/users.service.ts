import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import type { UserPreferences } from './interfaces/preferences.interface';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger('UsersService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly redisService: RedisService,
    ) { }

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;

            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });

            await this.userRepository.save(user);
            delete (user as any).password;
            return user;

        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    async findOneByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: { id: true, email: true, password: true, roles: true, fullName: true, isActive: true, preferences: true }
        });
        return user;
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    /**
     * Get user preferences with cache-aside pattern
     * 1. Try to get from Redis (fast)
     * 2. If not in cache, get from PostgreSQL
     * 3. Store in Redis for next time
     */
    async getPreferences(userId: string): Promise<UserPreferences> {
        const cacheKey = `user_preferences:${userId}`;

        // 1. Try cache first (cache hit)
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            this.logger.debug(`Cache HIT for preferences: ${userId}`);
            return JSON.parse(cached);
        }

        // 2. Cache miss - get from PostgreSQL
        this.logger.debug(`Cache MISS for preferences: ${userId}`);
        const user = await this.findOne(userId);
        const preferences = user.preferences || {};

        // 3. Store in Redis for next time (1 hour TTL)
        await this.redisService.set(
            cacheKey,
            JSON.stringify(preferences),
            60 * 60 // 1 hour
        );

        return preferences;
    }

    /**
     * Update user preferences
     * 1. Update in PostgreSQL (persistence)
     * 2. Update cache in Redis
     */
    async updatePreferences(
        userId: string,
        dto: UpdatePreferencesDto
    ): Promise<UserPreferences> {
        // 1. Update in PostgreSQL
        const user = await this.findOne(userId);
        user.preferences = { ...user.preferences, ...dto };
        await this.userRepository.save(user);

        // 2. Update cache in Redis
        const cacheKey = `user_preferences:${userId}`;
        await this.redisService.set(
            cacheKey,
            JSON.stringify(user.preferences),
            60 * 60 // 1 hour
        );

        this.logger.log(`Preferences updated for user: ${userId}`);
        return user.preferences;
    }

    private handleDBErrors(error: any): never {
        if (error.code === '23505')
            throw new BadRequestException(error.detail);

        this.logger.error(error);
        throw new InternalServerErrorException('Please check server logs');
    }
}
