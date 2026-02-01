import { IsString, MinLength, IsNumber, IsPositive, IsBoolean, IsOptional } from 'class-validator';

export class CreateServiciosTrabajoDto {
    @IsString()
    @MinLength(3)
    descripcion: string;

    @IsNumber()
    @IsPositive()
    costo: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateServiciosTrabajoDto extends CreateServiciosTrabajoDto { }
