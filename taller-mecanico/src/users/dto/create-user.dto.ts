import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsIn } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    fullName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsArray()
    roles?: string[];
}

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
