import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { ServiciosTrabajo } from '../servicios-trabajo/entities/servicios-trabajo.entity';
import { Repuesto } from '../repuestos/entities/repuesto.entity';
import { OrdenTrabajo } from '../orden-trabajo/entities/orden-trabajo.entity';
import { OrdenItem } from '../orden-trabajo/entities/orden-item.entity';

@Injectable()
export class SeedService {
    private readonly logger = new Logger('SeedService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ServiciosTrabajo)
        private readonly servicioRepository: Repository<ServiciosTrabajo>,
        @InjectRepository(Repuesto)
        private readonly repuestoRepository: Repository<Repuesto>,
        @InjectRepository(OrdenTrabajo)
        private readonly ordenRepository: Repository<OrdenTrabajo>,
        @InjectRepository(OrdenItem)
        private readonly itemRepository: Repository<OrdenItem>,
    ) { }

    async runSeed() {
        await this.cleanDatabase();
        await this.insertUsers();
        await this.insertServices();
        await this.insertParts();
        return 'SEED EXECUTED';
    }

    private async cleanDatabase() {
        // Delete in order to avoid FK constraints
        await this.itemRepository.createQueryBuilder().delete().execute();
        await this.ordenRepository.createQueryBuilder().delete().execute();

        await this.repuestoRepository.createQueryBuilder().delete().execute();
        await this.servicioRepository.createQueryBuilder().delete().execute();
        await this.userRepository.createQueryBuilder().delete().execute();
    }

    private async insertUsers() {
        const users = [
            {
                fullName: 'Admin User',
                email: 'admin@google.com',
                password: bcrypt.hashSync('admin123', 10),
                roles: [UserRole.ADMIN],
            },
            {
                fullName: 'Mecanico Juan',
                email: 'mecanico@google.com',
                password: bcrypt.hashSync('123456', 10),
                roles: [UserRole.MECHANIC],
            },
        ];

        await this.userRepository.save(users);
    }

    private async insertServices() {
        const services = [
            { descripcion: 'Cambio de Aceite', costo: 25.00 },
            { descripcion: 'Alineación y Balanceo', costo: 40.00 },
            { descripcion: 'Mano de Obra (Hora)', costo: 15.00 },
        ];
        await this.servicioRepository.save(services);
    }

    private async insertParts() {
        const parts = [
            { nombre: 'Filtro de Aceite', precioVenta: 10.00, stock: 100 },
            { nombre: 'Pastillas de Freno', precioVenta: 50.00, stock: 20 },
            { nombre: 'Aceite Sintético 5W30', precioVenta: 15.00, stock: 200 },
        ];
        await this.repuestoRepository.save(parts);
    }
}
