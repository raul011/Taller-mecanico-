import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { Repuesto } from './entities/repuesto.entity';

@Injectable()
export class RepuestosService {
  private readonly logger = new Logger('RepuestosService');

  constructor(
    @InjectRepository(Repuesto)
    private readonly repuestoRepository: Repository<Repuesto>,
  ) { }

  async create(createDto: CreateRepuestoDto) {
    try {
      const repuesto = this.repuestoRepository.create(createDto);
      await this.repuestoRepository.save(repuesto);
      return repuesto;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return this.repuestoRepository.find();
  }

  async findOne(id: number) {
    const repuesto = await this.repuestoRepository.findOneBy({ id });
    if (!repuesto) throw new NotFoundException(`Repuesto with id ${id} not found`);
    return repuesto;
  }

  async update(id: number, updateDto: CreateRepuestoDto) {
    const repuesto = await this.findOne(id);
    try {
      await this.repuestoRepository.update(id, updateDto);
      return { ...repuesto, ...updateDto };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const repuesto = await this.findOne(id);
    await this.repuestoRepository.remove(repuesto);
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
