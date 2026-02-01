import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiciosTrabajoDto } from './dto/create-servicios-trabajo.dto';
import { ServiciosTrabajo } from './entities/servicios-trabajo.entity';

@Injectable()
export class ServiciosTrabajoService {
  private readonly logger = new Logger('ServiciosTrabajoService');

  constructor(
    @InjectRepository(ServiciosTrabajo)
    private readonly servicioRepository: Repository<ServiciosTrabajo>,
  ) { }

  async create(createDto: CreateServiciosTrabajoDto) {
    try {
      const servicio = this.servicioRepository.create(createDto);
      await this.servicioRepository.save(servicio);
      return servicio;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return this.servicioRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number) {
    const servicio = await this.servicioRepository.findOneBy({ id });
    if (!servicio) throw new NotFoundException(`Service with id ${id} not found`);
    return servicio;
  }

  async update(id: number, updateDto: CreateServiciosTrabajoDto) {
    const servicio = await this.findOne(id);
    try {
      await this.servicioRepository.update(id, updateDto);
      return { ...servicio, ...updateDto };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const servicio = await this.findOne(id);
    // Soft delete
    servicio.isActive = false;
    await this.servicioRepository.save(servicio);
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
