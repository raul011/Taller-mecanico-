import { IsNumber, IsEnum, IsPositive, Min } from 'class-validator';
import { PaymentMethod } from '../entities/pago.entity';

export class CreatePagoDto {
    @IsNumber()
    ordenId: number;

    @IsNumber()
    @IsPositive()
    monto: number;

    @IsEnum(PaymentMethod)
    metodoPago: PaymentMethod;
}
