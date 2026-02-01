import { IsString, IsInt, Min, MinLength, IsNumber } from 'class-validator';

export class CreateAutoDto {
    @IsString()
    @MinLength(1)
    marca: string;

    @IsString()
    @MinLength(1)
    modelo: string;

    @IsString()
    @MinLength(1)
    placa: string;

    @IsInt()
    @Min(1900)
    anio: number;

    @IsNumber()
    clienteId: number;
}

export class UpdateAutoDto extends CreateAutoDto { }
