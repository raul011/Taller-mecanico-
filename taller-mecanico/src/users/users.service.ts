import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger('UsersService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
            select: { id: true, email: true, password: true, roles: true, fullName: true, isActive: true }
        });
        return user;
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    private handleDBErrors(error: any): never {
        if (error.code === '23505')
            throw new BadRequestException(error.detail);

        this.logger.error(error);
        throw new InternalServerErrorException('Please check server logs');
    }
}
