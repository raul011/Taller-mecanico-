
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { OrdenTrabajo } from '../../orden-trabajo/entities/orden-trabajo.entity';

@Entity('autos')
export class Auto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  placa: string;

  @Column()
  anio: number;

  @ManyToOne(() => Cliente, cliente => cliente.autos)
  cliente: Cliente;

  @OneToMany(() => OrdenTrabajo, orden => orden.auto)
  ordenes: OrdenTrabajo[];
}
