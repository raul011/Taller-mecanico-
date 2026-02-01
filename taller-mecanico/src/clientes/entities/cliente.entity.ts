
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Auto } from '../../autos/entities/auto.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  nombre: string;

  @Column('text')
  telefono: string;

  @Column('text', { unique: true, nullable: true })
  email: string;

  @OneToMany(() => Auto, auto => auto.cliente)
  autos: Auto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
