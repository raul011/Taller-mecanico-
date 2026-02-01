
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OrdenTrabajo } from '../../orden-trabajo/entities/orden-trabajo.entity';

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    TRANSFER = 'transfer',
}

@Entity('pagos')
export class Pago {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    monto: number;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CASH
    })
    metodoPago: PaymentMethod;

    @CreateDateColumn()
    fechaPago: Date;

    @ManyToOne(() => OrdenTrabajo, orden => orden['pagos'], { onDelete: 'CASCADE' }) // Need to add 'pagos' to OrdenTrabajo entity if we want reverse relation, or just uni-directional
    orden: OrdenTrabajo;
}
