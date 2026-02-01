import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAutoDto } from './dto/create-auto.dto';
import { Auto } from './entities/auto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class AutosService {
  private readonly logger = new Logger('AutosService');

  constructor(
    @InjectRepository(Auto)
    private readonly autoRepository: Repository<Auto>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) { }

  async create(createAutoDto: CreateAutoDto) {
    const { clienteId, ...autoData } = createAutoDto;

    const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
    if (!cliente) throw new NotFoundException(`Cliente with id ${clienteId} not found`);

    try {
      const auto = this.autoRepository.create({
        ...autoData,
        cliente,
      });
      await this.autoRepository.save(auto);
      return auto;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return this.autoRepository.find({ relations: { cliente: true } });
  }

  async findOne(id: number) {
    const auto = await this.autoRepository.findOne({
      where: { id },
      relations: { cliente: true }
    });
    if (!auto) throw new NotFoundException(`Auto with id ${id} not found`);
    return auto;
  }

  async findByPlaca(placa: string) {
    const auto = await this.autoRepository.findOne({
      where: { placa },
      relations: { cliente: true }
    });
    return auto;
  }

  async update(id: number, updateAutoDto: CreateAutoDto) {
    const auto = await this.findOne(id);
    const { clienteId, ...autoData } = updateAutoDto;

    // Check if client changed
    if (clienteId && (auto.cliente.id !== clienteId)) {
      const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
      if (!cliente) throw new NotFoundException(`Cliente with id ${clienteId} not found`);
      auto.cliente = cliente;
    }

    Object.assign(auto, autoData);
    await this.autoRepository.save(auto);
    return auto;
  }

  async remove(id: number) {
    const auto = await this.findOne(id);
    await this.autoRepository.remove(auto);
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
