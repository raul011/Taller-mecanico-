import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cita, CitaStatus } from './entities/cita.entity';
import { CreateCitaDto, UpdateCitaDto } from './dto/cita.dto';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Auto } from '../autos/entities/auto.entity';

@Injectable()
export class CitasService {
    constructor(
        @InjectRepository(Cita)
        private readonly citasRepository: Repository<Cita>,
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
        @InjectRepository(Auto)
        private readonly autosRepository: Repository<Auto>,
    ) { }

    async create(createCitaDto: CreateCitaDto) {
        const cliente = await this.clienteRepository.findOneBy({ id: createCitaDto.clienteId });
        if (!cliente) throw new NotFoundException('Cliente not found');

        let auto: Auto | null = null;
        if (createCitaDto.autoId) {
            auto = await this.autosRepository.findOneBy({ id: createCitaDto.autoId });
            if (!auto) throw new NotFoundException('Auto not found');
            // Optional: Check if auto belongs to cliente
            if (auto.cliente?.id !== cliente.id) {
                // throw new BadRequestException('Auto does not belong to client');
                // For now, relax this check or ensure auto entity has relation loaded
            }
        }

        const cita = this.citasRepository.create({
            fechaHora: new Date(createCitaDto.fechaHora),
            motivo: createCitaDto.motivo,
            notas: createCitaDto.notas,
            cliente,
            auto: auto || undefined,
            status: CitaStatus.PENDING,
        });

        return this.citasRepository.save(cita);
    }

    async findAll(start?: string, end?: string) {
        const where: any = {};

        if (start && end) {
            where.fechaHora = Between(new Date(start), new Date(end));
        } else if (start) {
            // If only start date is provided, show appointments from that date onwards
            where.fechaHora = Between(new Date(start), new Date(new Date(start).getFullYear() + 1, 0, 1));
        }

        return this.citasRepository.find({
            where,
            relations: ['cliente', 'auto', 'auto.cliente'],
            order: { fechaHora: 'ASC' },
        });
    }

    async findOne(id: number) {
        const cita = await this.citasRepository.findOne({
            where: { id },
            relations: ['cliente', 'auto'],
        });
        if (!cita) throw new NotFoundException(`Cita ${id} not found`);
        return cita;
    }

    async update(id: number, updateCitaDto: UpdateCitaDto) {
        const cita = await this.findOne(id);

        if (updateCitaDto.autoId) {
            const auto = await this.autosRepository.findOneBy({ id: updateCitaDto.autoId });
            if (!auto) throw new NotFoundException('Auto not found');
            cita.auto = auto;
        }

        if (updateCitaDto.fechaHora) cita.fechaHora = new Date(updateCitaDto.fechaHora);
        if (updateCitaDto.motivo) cita.motivo = updateCitaDto.motivo;
        if (updateCitaDto.status) cita.status = updateCitaDto.status;
        if (updateCitaDto.notas !== undefined) cita.notas = updateCitaDto.notas;

        return this.citasRepository.save(cita);
    }

    async remove(id: number) {
        const cita = await this.findOne(id);
        return this.citasRepository.remove(cita);
    }
}
