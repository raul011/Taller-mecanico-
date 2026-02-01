
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('servicios_trabajo')
export class ServiciosTrabajo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    descripcion: string;

    @Column('decimal', { precision: 10, scale: 2 })
    costo: number;

    @Column('bool', { default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
