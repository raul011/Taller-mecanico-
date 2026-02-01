
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RedisService } from '../redis/redis.service';
import type { AuthTokens, TokenPayload, RefreshTokenData } from './interfaces/tokens.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refresh_token);

    return {
      ...user,
      ...tokens,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    delete (user as any).password;

    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refresh_token);

    // ✅ Cache warming: Load preferences into Redis
    const preferences = user.preferences || {};
    const cacheKey = `user_preferences:${user.id}`;
    await this.redisService.set(
      cacheKey,
      JSON.stringify(preferences),
      60 * 60 // 1 hour
    );

    return {
      ...user,
      ...tokens,
      preferences, // Return preferences to frontend
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if token exists in Redis
      const tokenKey = `refresh_token:${payload.id}`;
      const storedToken = await this.redisService.get(tokenKey);

      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user
      const user = await this.usersService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Delete old refresh token
      await this.redisService.delete(tokenKey);

      // Generate new tokens
      const tokens = await this.generateTokens(user);
      await this.storeRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    const tokenKey = `refresh_token:${userId}`;
    await this.redisService.delete(tokenKey);
    return { message: 'Logged out successfully' };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id, email: user.email }),
    };
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = { id: user.id, email: user.email };

    // Access token (1 hora)
    const access_token = await this.jwtService.signAsync(payload);

    // Refresh token (7 días) - usando secret diferente
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const tokenKey = `refresh_token:${userId}`;
    const ttl = 7 * 24 * 60 * 60; // 7 days in seconds

    await this.redisService.set(tokenKey, token, ttl);
  }

  private getJwtToken(payload: TokenPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
