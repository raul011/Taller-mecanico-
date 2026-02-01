import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateClienteDto {
    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(1)
    telefono: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;
}

export class UpdateClienteDto extends CreateClienteDto { }
