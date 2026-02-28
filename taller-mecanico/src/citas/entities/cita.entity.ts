import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Auto } from '../../autos/entities/auto.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

export enum CitaStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('citas')
export class Cita {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fechaHora: Date; // Date and Time of appointment

    @Column('text')
    motivo: string; // Reason for visit

    @Column({
        type: 'enum',
        enum: CitaStatus,
        default: CitaStatus.PENDING
    })
    status: CitaStatus;

    @ManyToOne(() => Cliente, { nullable: false })
    cliente: Cliente;

    @ManyToOne(() => Auto, { nullable: true })
    auto: Auto; // Optional immediately, can be assigned later

    @Column({ nullable: true })
    notas: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
