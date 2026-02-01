import { IsString, IsNumber, IsOptional, Min, MinLength, IsInt } from 'class-validator';

export class CreateRepuestoDto {
    @IsString()
    @MinLength(3)
    nombre: string;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsNumber()
    @Min(0)
    precioVenta: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    costoCompra?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    stock?: number;
}

export class UpdateRepuestoDto extends CreateRepuestoDto { }
