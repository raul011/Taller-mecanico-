
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Auto } from '../../autos/entities/auto.entity';
import { User } from '../../users/entities/user.entity';
import { OrdenItem } from './orden-item.entity';

export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    FINISHED = 'finished',
    PAID = 'paid',
    CANCELLED = 'cancelled',
}

@Entity('ordenes_trabajo')
export class OrdenTrabajo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @CreateDateColumn()
    dateIn: Date;

    @Column({ nullable: true })
    dateOut: Date;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    total: number;

    @Column('text', { nullable: true })
    observaciones: string;

    @ManyToOne(() => Auto, auto => auto.ordenes) // We need to fix Auto entity to have 'ordenes'
    auto: Auto;

    @ManyToOne(() => User, { nullable: true })
    mechanic: User;

    @OneToMany(() => OrdenItem, item => item.orden, { cascade: true })
    items: OrdenItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
