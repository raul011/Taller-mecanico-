
export enum UserRole {
    ADMIN = 'admin',
    MECHANIC = 'mechanic',
    CASHIER = 'cashier',
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text', { select: false })
    password: string;

    @Column('text', {
        array: true,
        default: [UserRole.MECHANIC],
    })
    roles: string[];

    @Column('bool', { default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
