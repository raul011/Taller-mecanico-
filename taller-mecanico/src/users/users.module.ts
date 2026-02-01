import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller'; // Not strictly needed if only used by Auth, but good for Admin
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [], // No controller for now, mainly for Auth
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule { }

