
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrdenTrabajo } from './orden-trabajo.entity';

export enum ItemType {
    SERVICE = 'service',
    PART = 'part',
}

@Entity('orden_items')
export class OrdenItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ItemType,
    })
    type: ItemType;

    // ID of the Service or Part
    @Column()
    itemId: number;

    @Column('text')
    itemName: string;

    @Column('int', { default: 1 })
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => OrdenTrabajo, orden => orden.items, { onDelete: 'CASCADE' })
    orden: OrdenTrabajo;
}
