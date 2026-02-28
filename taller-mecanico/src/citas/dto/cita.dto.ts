import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CitaStatus } from '../entities/cita.entity';

export class CreateCitaDto {
    @IsNotEmpty()
    @IsDateString()
    fechaHora: string;

    @IsNotEmpty()
    @IsString()
    motivo: string;

    @IsNotEmpty()
    @IsNumber()
    clienteId: number;

    @IsOptional()
    @IsNumber()
    autoId?: number;

    @IsOptional()
    @IsString()
    notas?: string;
}

export class UpdateCitaDto {
    @IsOptional()
    @IsDateString()
    fechaHora?: string;

    @IsOptional()
    @IsString()
    motivo?: string;

    @IsOptional()
    @IsEnum(CitaStatus)
    status?: CitaStatus;

    @IsOptional()
    @IsNumber()
    autoId?: number;

    @IsOptional()
    @IsString()
    notas?: string;
}
