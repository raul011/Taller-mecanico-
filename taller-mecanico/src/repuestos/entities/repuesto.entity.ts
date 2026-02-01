
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('repuestos')
export class Repuesto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    nombre: string;

    @Column('text', { nullable: true })
    sku: string;

    @Column('text', { nullable: true })
    descripcion: string;

    @Column('decimal', { precision: 10, scale: 2 })
    precioVenta: number; // Selling price

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    costoCompra: number; // Purchase cost (for internal use)

    @Column('int', { default: 0 })
    stock: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
