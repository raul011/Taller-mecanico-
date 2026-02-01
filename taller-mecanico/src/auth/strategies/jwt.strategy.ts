
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || process.env.JWT_SECRET || 'secretKey',
        });
    }

    async validate(payload: any) {
        const { id } = payload;
        const user = await this.userRepository.findOneBy({ id });

        if (!user)
            throw new UnauthorizedException('Token not valid');

        if (!user.isActive)
            throw new UnauthorizedException('User is inactive, talk with an admin');

        return user;
    }
}
